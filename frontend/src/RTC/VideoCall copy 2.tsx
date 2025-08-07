import { useState, useRef } from 'react';
import { OpenVidu, Session } from 'openvidu-browser';
import axios from 'axios';
import myaxios from '@/api/auth';

const VideoCall = () => {
  const [sessionId, setSessionId] = useState('');
  const OVRef = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);

  async function joinSession() {
    try {
      const res = await myaxios.get('/video/get-token', {
        params: { session_id: sessionId },
      });
      console.log('token:', res.data);
      const tokenUrl: string = res.data.token;
      const pureToken = tokenUrl.split('token=')[1];

      OVRef.current = new OpenVidu();
      (OVRef.current as any).openviduServerUrl = 'https://70.12.246.252';

      sessionRef.current = OVRef.current.initSession();

      sessionRef.current.on('streamCreated', (event) => {
        sessionRef.current?.subscribe(event.stream, 'remote-video');
      });

      await sessionRef.current.connect(tokenUrl);
      // await sessionRef.current.connect(pureToken.trim());

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

      <div>
        <video id="local-video" autoPlay playsInline muted></video>
        <video id="remote-video" autoPlay playsInline></video>
      </div>
    </div>
  );
};

export default VideoCall;
