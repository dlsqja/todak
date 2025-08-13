import { useEffect, useRef, useState } from 'react';
import KurentoUtils from 'kurento-utils';

export default function VideoCallOpenAI() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socket = useRef<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState('');
  const sessionIdRef = useRef('');
  const webRtcPeerRef = useRef<any>(null);

  // === STT(Reatime API) 상태 ===
  const [isSTTOn, setIsSTTOn] = useState(false);
  const [partialText, setPartialText] = useState('');
  const [finalText, setFinalText] = useState('');
  const realtimePCRef = useRef<RTCPeerConnection | null>(null);
  const realtimeDCRef = useRef<RTCDataChannel | null>(null); // "oai-events" 데이터채널
  const sttAudioTrackRef = useRef<MediaStreamTrack | null>(null);

  const publicUrl = import.meta.env.VITE_EC2_PUBLIC;
  const publicPort = import.meta.env.VITE_COTURN_PORT;

  const onMessage = (message: MessageEvent) => {
    const parsed = JSON.parse(message.data);

    switch (parsed.id) {
      case 'startResponse':
        webRtcPeerRef.current?.processAnswer(parsed.sdpAnswer);
        break;
      case 'iceCandidate':
        if (parsed.candidate) {
          webRtcPeerRef.current?.addIceCandidate(parsed.candidate);
        }
        break;
      case 'peerLeft':
        endCall();
        break;
      default:
        console.warn('Unrecognized message', parsed);
        break;
    }
  };

  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl =
      wsProtocol === 'wss' ? `${wsProtocol}://${window.location.host}/ws` : `${wsProtocol}://localhost:8080/api/v1/ws`;

    const ws = new WebSocket(wsUrl);
    ws.onopen = () => {
      console.log('WS opened');
      socket.current = ws;
    };
    ws.onmessage = onMessage;

    return () => {
      ws.close();
      socket.current = null;
    };
  }, []);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  const endCall = () => {
    socket.current?.send(
      JSON.stringify({
        id: 'leave',
        sessionId: sessionIdRef.current,
      }),
    );
    webRtcPeerRef.current?.dispose();
    webRtcPeerRef.current = null;
    stopLocalVideo();
    stopRemoteVideo();
  };

  const stopLocalVideo = () => {
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      localVideoRef.current!.srcObject = null;
    }
  };

  const stopRemoteVideo = () => {
    if (remoteVideoRef.current?.srcObject) {
      (remoteVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      remoteVideoRef.current.srcObject = null;
    }
  };

  const startCall = () => {
    if (sessionId === '') {
      alert('방 이름을 작성하세요');
      return;
    }

    const options = {
      localVideo: localVideoRef.current!,
      remoteVideo: remoteVideoRef.current!,
      onicecandidate: (candidate: RTCIceCandidate) => {
        if (candidate) {
          socket.current?.send(
            JSON.stringify({
              id: 'onIceCandidate',
              candidate,
            }),
          );
        }
      },
      configuration: {
        iceServers: [
          { urls: `stun:${publicUrl}:${publicPort}` },
          {
            urls: `turn:${publicUrl}:${publicPort}?transport=udp`,
            username: 'myuser',
            credential: 'mypassword',
          },
        ],
      },
    };

    const webRtcPeer = KurentoUtils.WebRtcPeer.WebRtcPeerSendrecv(options, function (err: any) {
      if (err) return console.error(err);

      webRtcPeer.generateOffer((err: any, sdpOffer: string) => {
        if (err) return console.error(err);

        socket.current?.send(
          JSON.stringify({
            id: 'join',
            sessionId: sessionId,
            sdpOffer,
          }),
        );
      });
    });

    webRtcPeerRef.current = webRtcPeer;
  };

  // =========================
  // Realtime API (STT) 부분
  // =========================

  // 마이크 트랙 확보: 가능하면 Kurento가 이미 잡은 로컬 스트림에서 오디오 트랙 재사용
  async function getLocalAudioTrack(): Promise<MediaStreamTrack> {
    // KurentoUtils가 localVideo에 올려둔 스트림에서 오디오 트랙을 우선 찾음
    const fromKurento =
      localVideoRef.current?.srcObject && (localVideoRef.current.srcObject as MediaStream).getAudioTracks()[0];

    if (fromKurento) return fromKurento;

    // 아직 통화 전이거나 트랙이 없으면 getUserMedia로 새로 획득
    const gum = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    return gum.getAudioTracks()[0];
  }

  async function startSTT() {
    if (isSTTOn) return;
    try {
      // 1) 서버에서 에페메럴 토큰 받아오기 (서버 구현 필요)
      const tokRes = await fetch('/api/openai/realtime-token', { method: 'GET' });
      if (!tokRes.ok) throw new Error('Failed to get Realtime token');
      const { token } = await tokRes.json();

      // 2) RTCPeerConnection 생성
      const pc = new RTCPeerConnection({
        // 굳이 넣을 필요는 없지만 사내 프록시/방화벽 환경이면 STUN/Relay 넣을 수도 있음
        // iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      });
      realtimePCRef.current = pc;

      // 3) 이벤트 채널 생성 (서버 -> 클라 이벤트 수신)
      const dc = pc.createDataChannel('oai-events');
      realtimeDCRef.current = dc;
      dc.onmessage = (ev) => {
        // 이벤트는 JSON 문자열로 전달됨
        try {
          const msg = JSON.parse(ev.data);

          // Realtime Transcription 가이드 기준 이벤트 핸들링
          // (각 이벤트 네이밍은 지속적으로 업데이트될 수 있음)
          // - transcript.delta: 부분 자막
          // - transcript.completed: 1문장 등 최종 자막
          // - response.*: 일반 응답 이벤트
          if (msg.type === 'transcript.delta' && typeof msg.delta === 'string') {
            setPartialText(msg.delta);
          } else if (msg.type === 'transcript.completed' && typeof msg.text === 'string') {
            setFinalText((prev) => (prev ? prev + '\n' : '') + msg.text);
            setPartialText('');
          } else if (msg.type?.startsWith('response.')) {
            // 필요시 로깅
            // console.log('response event', msg);
          }
        } catch {
          // console.log('non-json event', ev.data);
        }
      };

      // 4) 오디오 트랙 추가 (Kurento 로컬 오디오 트랙 재사용 시 에코 감소)
      const audioTrack = await getLocalAudioTrack();
      sttAudioTrackRef.current = audioTrack;
      const stream = new MediaStream([audioTrack]);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      // 5) SDP Offer 생성 및 전송
      const offer = await pc.createOffer({
        offerToReceiveAudio: true, // 서버가 보내는(필요하다면) 오디오 수신 허용
        offerToReceiveVideo: false,
      });
      await pc.setLocalDescription(offer);

      // 6) OpenAI Realtime(WebRTC) 엔드포인트로 SDP 전송 → Answer 수신
      //    모델명은 사용 가능 모델로 교체 가능 (예: gpt-4o-realtime-preview)
      const realtimeUrl = 'https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview';
      const sdpResp = await fetch(realtimeUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // 반드시 에페메럴 토큰
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });
      if (!sdpResp.ok) throw new Error('Realtime SDP exchange failed');
      const answerSdp = await sdpResp.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      // 7) 연결 상태/ICE 로그
      pc.onconnectionstatechange = () => {
        console.log('Realtime PC state:', pc.connectionState);
        if (
          pc.connectionState === 'failed' ||
          pc.connectionState === 'closed' ||
          pc.connectionState === 'disconnected'
        ) {
          stopSTT();
        }
      };

      setIsSTTOn(true);
    } catch (e) {
      console.error(e);
      stopSTT();
      alert('STT 시작 중 오류가 발생했습니다.');
    }
  }

  function stopSTT() {
    setIsSTTOn(false);
    try {
      realtimeDCRef.current?.close();
    } catch {}
    realtimeDCRef.current = null;

    try {
      realtimePCRef.current?.getSenders().forEach((s) => {
        try {
          s.track?.stop();
        } catch {}
      });
      realtimePCRef.current?.close();
    } catch {}
    realtimePCRef.current = null;

    // Kurento용 마이크를 재사용했다면 실제 트랙 stop은 하지 않는 편이 안전
    // (위에서 sender.track.stop()은 STT 전용 getUserMedia를 쓴 경우에만 효과)
    sttAudioTrackRef.current = null;
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex gap-2">
        <div>
          <p className="text-sm">내 화면</p>
          <video ref={localVideoRef} autoPlay playsInline muted className="border w-64 h-48 bg-gray-200" />
        </div>
        <div>
          <p className="text-sm">상대방 화면</p>
          <video ref={remoteVideoRef} autoPlay playsInline className="border w-64 h-48 bg-gray-200" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="접속할 방 이름을 적어주세요"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <button onClick={startCall} className="px-4 py-2 bg-blue-600 text-white rounded">
          통화 시작
        </button>
        <button onClick={endCall} className="px-4 py-2 bg-gray-600 text-white rounded">
          통화 종료
        </button>
      </div>

      {/* STT 컨트롤 */}
      <div className="flex items-center gap-2">
        {!isSTTOn ? (
          <button onClick={startSTT} className="px-4 py-2 bg-emerald-600 text-white rounded">
            STT 시작
          </button>
        ) : (
          <button onClick={stopSTT} className="px-4 py-2 bg-rose-600 text-white rounded">
            STT 종료
          </button>
        )}
        <span className="text-sm">{isSTTOn ? '실시간 STT 연결됨' : 'STT 꺼짐'}</span>
      </div>

      {/* 자막 표시 */}
      <div className="space-y-1">
        <div className="text-xs text-gray-500">실시간(부분)</div>
        <div className="min-h-6 whitespace-pre-line border rounded p-2 bg-gray-50">{partialText}</div>
        <div className="text-xs text-gray-500 mt-2">최종</div>
        <div className="min-h-12 whitespace-pre-line border rounded p-2">{finalText}</div>
      </div>
    </div>
  );
}
