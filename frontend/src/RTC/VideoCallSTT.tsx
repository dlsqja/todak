import { useEffect, useRef, useState } from 'react';

// KurentoUtils mock for demonstration - you'll need to import the actual library
import KurentoUtils from 'kurento-utils';

export default function VideoCallSTT() {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socket = useRef<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState('');
  const sessionIdRef = useRef('');
  const webRtcPeerRef = useRef<any>(null);

  // STT 관련 상태
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const [isSTTSupported, setIsSTTSupported] = useState(false);

  const publicUrl = import.meta.env.VITE_EC2_PUBLIC;
  const publicPort = import.meta.env.VITE_COTURN_PORT;

  // STT 초기화
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSTTSupported(true);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'ko-KR'; // 한국어 설정, 필요시 'en-US'로 변경

      recognition.onstart = () => {
        console.log('음성 인식 시작');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
          } else {
            interimTranscript += result[0].transcript;
          }
        }

        setTranscript(interimTranscript);
        if (finalText) {
          setFinalTranscript((prev) => prev + finalText + ' ');
        }
      };

      recognition.onerror = (event: any) => {
        console.error('음성 인식 오류:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('음성 인식 종료');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('이 브라우저는 Speech Recognition을 지원하지 않습니다.');
      setIsSTTSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

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
    stopSTT(); // STT도 함께 종료
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

  // STT 제어 함수들
  const startSTT = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopSTT = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setFinalTranscript('');
  };

  const toggleSTT = () => {
    if (isListening) {
      stopSTT();
    } else {
      startSTT();
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <div>
          <p className="text-sm mb-2 font-medium">내 화면</p>
          <video ref={localVideoRef} autoPlay playsInline muted className="border w-64 h-48 bg-gray-200 rounded" />
        </div>
        <div>
          <p className="text-sm mb-2 font-medium">상대방 화면</p>
          <video ref={remoteVideoRef} autoPlay playsInline className="border w-64 h-48 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="접속할 방 이름을 적어주세요"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <button
            onClick={startCall}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            통화 시작
          </button>
          <button
            onClick={endCall}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            통화 종료
          </button>
        </div>
      </div>

      {/* STT 섹션 */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="text-lg font-medium">음성 인식 (STT)</h3>

        {!isSTTSupported ? (
          <p className="text-red-600">이 브라우저는 음성 인식을 지원하지 않습니다.</p>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={toggleSTT}
                className={`px-4 py-2 rounded transition-colors ${
                  isListening ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isListening ? '음성 인식 중지' : '음성 인식 시작'}
              </button>

              <button
                onClick={clearTranscript}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                텍스트 지우기
              </button>
            </div>

            {isListening && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">음성을 인식하고 있습니다...</span>
              </div>
            )}

            <div className="space-y-2">
              <div>
                <p className="text-sm font-medium text-gray-700">실시간 인식 (임시):</p>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded min-h-[3rem]">
                  <p className="text-gray-800 italic">{transcript || '음성을 인식 중...'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">완료된 텍스트:</p>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded min-h-[6rem] max-h-32 overflow-y-auto">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {finalTranscript || '완료된 텍스트가 여기에 표시됩니다.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
