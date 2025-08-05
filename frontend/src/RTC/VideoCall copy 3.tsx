import { useState, useRef } from 'react';
import { OpenVidu, Session, StreamManager } from 'openvidu-browser';
import myaxios from '@/api/axios-common';

const VideoCall = () => {
  const [sessionId, setSessionId] = useState('');
  const OVRef = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  async function joinSession() {
    try {
      // 1. 카메라·마이크 접근 테스트
      console.log('[CHECK] Requesting camera/mic access...');
      const testStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log('[CHECK] Camera/mic access granted');
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = testStream;
        await localVideoRef.current.play();
        console.log('[CHECK] Local video test stream playing');
      }

      // 2. OpenVidu 토큰 요청
      const res = await myaxios.get('/video/get-token', {
        params: { session_id: sessionId },
      });
      console.log('[TOKEN]', res.data);
      const tokenUrl: string = res.data.token;

      OVRef.current = new OpenVidu();
      (OVRef.current as any).openviduServerUrl = 'https://70.12.246.252';

      sessionRef.current = OVRef.current.initSession();

      // 3. 리모트 스트림 구독
      sessionRef.current.on('streamCreated', (event) => {
        console.log('[REMOTE] streamCreated', event.stream);
        const subscriber: StreamManager = sessionRef.current!.subscribe(event.stream, undefined);
        subscriber.on('videoElementCreated', (e) => {
          console.log('[REMOTE] videoElementCreated');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = e.element.srcObject;
            remoteVideoRef.current.play().catch((err) => console.error('[REMOTE] play error', err));
          }
        });
      });

      // 4. 세션 연결
      await sessionRef.current.connect(tokenUrl);
      console.log('[SESSION] connected');

      // 5. 로컬 스트림 생성
      const publisher = OVRef.current.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: '640x480',
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: true,
      });

      publisher.on('videoElementCreated', (e) => {
        console.log('[LOCAL] videoElementCreated');
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = e.element.srcObject;
          localVideoRef.current
            .play()
            .then(() => console.log('[LOCAL] play success'))
            .catch((err) => console.error('[LOCAL] play error', err));
        }
      });

      sessionRef.current.publish(publisher);
      console.log('[SESSION] publisher published');
    } catch (err) {
      console.error('세션 참가 실패 또는 카메라 접근 실패:', err);
    }
  }

  function leaveSession() {
    if (sessionRef.current) {
      sessionRef.current.disconnect();
    }
    sessionRef.current = null;
    OVRef.current = null;
  }

  return (
    <div>
      <input type="text" value={sessionId} onChange={(e) => setSessionId(e.target.value)} />
      <button onClick={joinSession}>세션참가</button>
      <button onClick={leaveSession}>세션종료</button>

      <div>
        <video ref={localVideoRef} autoPlay playsInline muted></video>
        <video ref={remoteVideoRef} autoPlay playsInline></video>
      </div>
    </div>
  );
};

export default VideoCall;
