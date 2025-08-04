import { useState, useRef } from 'react';
import { OpenVidu, Session } from 'openvidu-browser';
import myaxios from '@/api/axios-common';

const VideoCall = () => {
  const [sessionId, setSessionId] = useState('');
  const OVRef = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);

  async function joinSession() {
    try {
      const res = await myaxios.get('/video/get-token', {
        params: { session_id: sessionId },
      });
      const token = res.data.data.token; // 서버 응답 구조에 맞게 수정
      console.log('res.data', token);

      OVRef.current = new OpenVidu();
      sessionRef.current = OVRef.current.initSession();

      sessionRef.current.on('streamCreated', (event) => {
        sessionRef.current?.subscribe(event.stream, 'remote-video');
      });

      await sessionRef.current.connect(token);
      const publisher = OVRef.current.initPublisher('local-video');
      sessionRef.current.publish(publisher);
    } catch (err) {
      console.error('세션 참가 실패:', err);
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

      {/* 비디오 영역 */}
      <div>
        <video id="local-video" autoPlay playsInline muted></video>
        <video id="remote-video" autoPlay playsInline></video>
      </div>
    </div>
  );
};

export default VideoCall;
