import { useEffect, useRef, useState } from 'react';
import KurentoUtils from 'kurento-utils';

export default function VideoCall() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socket = useRef<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState('');
  const sessionIdRef = useRef('');
  const webRtcPeerRef = useRef<any>(null);

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
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const wsUrl =
      wsProtocol === 'wss' ? `${wsProtocol}://${window.location.host}/ws` : `${wsProtocol}://localhost:8080/ws`;
    // console.log('socket url:', wsUrl);
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
            sessionId: sessionId,
            sdpOffer,
          }),
        );
      });
    });

    webRtcPeerRef.current = webRtcPeer;
  };

  return (
    <div className="p-4 space-y-2">
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
      <input
        type="text"
        placeholder="접속할 방 이름을 적어주세요"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
      />
      <button onClick={startCall} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        통화시작
      </button>
      <button onClick={endCall} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
        통화 종료
      </button>
    </div>
  );
}
