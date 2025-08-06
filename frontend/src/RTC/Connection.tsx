import { useState } from 'react';

function Connection() {
  const publicUrl = import.meta.env.VITE_EC2_PUBLIC;
  const publicPort = import.meta.env.VITE_COTURN_PORT;
  const [iceLog, setIceLog] = useState<string[]>([]);

  const handleIceTest = async () => {
    console.log('[ICE SERVERS]', [`stun:${publicUrl}:${publicPort}`, `turn:${publicUrl}:${publicPort}?transport=udp`]);

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: `stun:${publicUrl}:${publicPort}` },
        {
          urls: `turn:${publicUrl}:${publicPort}?transport=udp`,
          username: 'myuser',
          credential: 'mypassword',
        },
      ],
    });

    // ⭐ 핵심: 더미 데이터 채널 추가 (미디어 스트림 대신)
    pc.createDataChannel('test');

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('[ICE]', event.candidate.candidate);
        setIceLog((prev) => [...prev, `[ICE]: ${event.candidate?.candidate}`]);
      } else {
        console.log('[ICE] 후보 수집 완료');
        setIceLog((prev) => [...prev, '[ICE] 후보 수집 완료']);
      }
    };

    // ICE 수집 상태 모니터링
    pc.onicegatheringstatechange = () => {
      console.log('ICE gathering state:', pc.iceGatheringState);
    };

    try {
      const offer = await pc.createOffer();
      console.log('[OFFER]', offer.sdp);
      await pc.setLocalDescription(offer);
      console.log('[SDP] Local description set');
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[ERROR]', err);
        setIceLog((prev) => [...prev, `[ERROR] ${err.message}`]);
      } else {
        console.error('[UNKNOWN ERROR]', err);
        setIceLog((prev) => [...prev, `[ERROR] Unknown error occurred`]);
      }
    }
  };

  return (
    <>
      <h2>ICE 후보 수집 로그</h2>
      <button onClick={handleIceTest}>ICE 테스트 실행</button>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {iceLog.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    </>
  );
}

export default Connection;
