import { useEffect, useRef, useState } from 'react';
import * as KurentoUtils from 'kurento-utils';
import { replace, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '@/plugins/axios';
import SimpleHeader from '@/component/header/SimpleHeader';
import MikeIcon from '@/component/icon/MikeIcon';
import CallingEndIcon from '@/component/icon/CallingEndIcon';
import SpeakerIcon from '@/component/icon/SpeakerIcon';

// sessionId는 reservatioId로 -> private_key니깐. 웹소켓으로 진행하므로, socketId로 back에서 구분. sessionId만 필요하다.
export default function VetRTC() {
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

    const boot = async () => {
      const treatment = location.state as { treatmentId: number } | null;
      if (!treatment) {
        alert('해당 세션에 접근할 수 없습니다.');
        navigator(-1);
        return;
      }

      // 세션 아이디 설정
      sessionIdRef.current = String(treatment.treatmentId);

      // ✅ 방 입장 검증을 먼저 수행하고 결과를 기다림
      const ok = await checkRoom(sessionIdRef.current);
      if (!ok || cancelled) return;

      // ✅ 검증 통과 후에만 WS 연결
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

    boot();

    return () => {
      cancelled = true;
      socket.current?.close();
      socket.current = null;
      console.log('socket end');
    };
  }, []);

  async function checkRoom(roomid: string): Promise<boolean> {
    try {
      await apiClient.patch(`/treatments/vets/join/${roomid}`);
      return true;
    } catch (err) {
      alert('현재 진료를 할 수 없습니다. 다시 확인해주세요.');
      navigator(-1);
      return false;
    }
  }

  const endCall = async () => {
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
    await apiClient
      .delete(`treatments/vets/end/${sessionIdRef.current}`)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    alert('진료가 종료되었습니다.');
    navigator('/vet/home');
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
    <div className="h-full bg-gray-50 flex flex-col rounded-2xl">
      <SimpleHeader text="비대면 진료 중..." />
      <div className="relative flex-1 bg-black">
        {/* 상대방 화면  */}
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover bg-gray-50" />

        {/* 내 화면  */}
        <div className="absolute top-4 right-4 w-32 h-24">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover bg-gray-50 rounded-lg"
          />
          <p className="absolute -bottom-6 left-0 text-black caption-bold">내 화면</p>
        </div>

        {/* 반려인 화면 */}
        <div className="absolute top-4 left-7">
          <p className="text-white p bg-pink-200 bg-opacity-50 px-2 py-1 rounded-[12px]">반려인 화면</p>
        </div>

        {/* 컨트롤 버튼들 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-8 justify-center items-center">
            <MikeIcon fill="#F0F0F0" iconFill="#B3B3B3" stroke="inherit" width={52} height={52} />
            <CallingEndIcon fill="#D14D72" stroke="white" width={52} height={52} onClick={endCall} />
            <SpeakerIcon fill="#F0F0F0" iconFill="#B3B3B3" stroke="inherit" width={52} height={52} />
          </div>
        </div>
      </div>
    </div>
  );
}
