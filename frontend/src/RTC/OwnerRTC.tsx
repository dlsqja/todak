import { useEffect, useRef, useState } from 'react';
import * as KurentoUtils from 'kurento-utils';
import { replace, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '@/plugins/axios';

// sessionId는 reservatioId로 -> private_key니깐. 웹소켓으로 진행하므로, socketId로 back에서 구분. sessionId만 필요하다.
export default function OwnerRTC() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socket = useRef<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState('');
  const sessionIdRef = useRef('');
  const webRtcPeerRef = useRef<any>(null);
  const location = useLocation();
  const navigator = useNavigate();

  const publicUrl = import.meta.env.VITE_EC2_PUBLIC;
  const publicPort = import.meta.env.VITE_COTURN_PORT;

  const onMessage = (message: MessageEvent) => {
    const parsed = JSON.parse(message.data);

    switch (parsed.id) {
      case 'startResponse':
        webRtcPeerRef.current?.processAnswer(parsed.sdpAnswer);
        break;
      case 'iceCandidate':
        // 서버 → 브라우저 ICE 후보
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
    let cancelled = false;

    const run = async () => {
      const treatment = location.state as { treatmentId: number } | null;
      if (!treatment) {
        alert('해당 세션에 접근할 수 없습니다.');
        navigator(-1);
        return;
      }
      sessionIdRef.current = String(treatment.treatmentId);

      const ok = await checkRoom(sessionIdRef.current);
      if (!ok || cancelled) return; // ← 실패하면 즉시 종료

      const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
      const wsUrl =
        wsProtocol === 'wss'
          ? `${wsProtocol}://${window.location.host}/ws`
          : `${wsProtocol}://localhost:8080/api/v1/ws`;

      const ws = new WebSocket(wsUrl);
      socket.current = ws;

      ws.onopen = () => {
        if (cancelled) return;
        console.log('WS opened');
        startCall();
      };
      ws.onmessage = onMessage;
    };

    run();

    return () => {
      cancelled = true;
      socket.current?.close();
      socket.current = null;
    };
  }, []);

  async function checkRoom(roomid: string): Promise<boolean> {
    try {
      await apiClient.patch(`/treatments/owner/start/${roomid}`);
      return true;
    } catch (err) {
      alert('현재 진료를 할 수 없습니다. 다시 확인해주세요.');
      navigator(-1);
      return false;
    }
  }

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
    alert('진료가 종료되었습니다.');
    navigator(-1);
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
    if (sessionIdRef.current === '') {
      alert('방 이름을 작성하세요');
      return;
    }
    // console.log('[ICE SERVERS]', [`stun:${publicUrl}:${publicPort}`, `turn:${publicUrl}:${publicPort}?transport=udp`]);

    const options = {
      localVideo: localVideoRef.current!, // 내 카메라 영상
      remoteVideo: remoteVideoRef.current!, // 상대방 영상
      onicecandidate: (candidate: RTCIceCandidate) => {
        if (candidate) {
          socket.current?.send(
            JSON.stringify({
              id: 'onIceCandidate',
              candidate, // 객체 전체
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
            sessionId: sessionIdRef.current,
            sdpOffer,
          }),
        );
      });
    });

    webRtcPeerRef.current = webRtcPeer;
  };

  return (
    <div className="flex-col gap-2 p-4 space-y-2 text-center">
      <div>
        <p className="text-sm">내 화면</p>
        <video ref={localVideoRef} autoPlay playsInline muted className="border w-full h-full bg-gray-200" />
      </div>
      <div>
        <p className="text-sm">상대방 화면</p>
        <video ref={remoteVideoRef} autoPlay playsInline className="border w-full h-full bg-gray-200" />
      </div>
      <div className="flex gap-2 justify-center">
        {/* <input
          type="text"
          placeholder="접속할 방 이름을 적어주세요"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="mt-2 px-4 py-2 bg-gray-500 rounded w-40"
        /> */}
        {/* <button onClick={startCall} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          통화시작
        </button> */}
        <button onClick={endCall} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          통화 종료
        </button>
      </div>
    </div>
  );
}
