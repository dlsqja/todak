import { useEffect, useRef, useState } from "react";

const VideoCall = () => {
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // 환경에 따른 WebSocket URL 설정
  const wsUrl =
    window.location.hostname === "localhost"
      ? "ws://localhost:8080/ws" // 로컬 개발환경
      : "wss://i13a409.p.ssafy.io/ws"; // 배포환경
  const publicUrl = import.meta.env.VITE_EC2_PUBLIC;
  const coturnPort = import.meta.env.VITE_COTURN_PORT;
  const stunTurn = {
    iceServers: [
      { urls: `stun:${publicUrl}:${coturnPort}` },
      {
        urls: `turn:${publicUrl}:${coturnPort}`,
        username: "myuser",
        credential: "mypassword",
      },
    ],
  };

  const addLog = (msg: string) => {
    const logMessage = `${new Date().toLocaleTimeString()} ${msg}`;
    setLogs((prev) => [...prev, logMessage]);
    console.log("VideoCall:", logMessage); // 콘솔에도 출력
  };

  const getTargetId = () => (userId === "user1" ? "user2" : "user1");

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(stunTurn);

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        addLog(`ICE candidate 생성: ${event.candidate.type}`);
        wsRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            roomId,
            senderId: userId,
            targetId: getTargetId(),
            candidate: event.candidate,
          })
        );
      } else if (!event.candidate) {
        addLog("ICE gathering 완료");
      }
    };

    pc.ontrack = (event) => {
      addLog("상대방 스트림 수신!");
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        addLog("원격 비디오 설정 완료");
      }
    };

    pc.onconnectionstatechange = () => {
      addLog(`연결 상태: ${pc.connectionState}`);
    };

    pc.oniceconnectionstatechange = () => {
      addLog(`ICE 연결 상태: ${pc.iceConnectionState}`);
    };

    // 이미 로컬 스트림이 있다면 트랙 추가
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current!);
        addLog(`트랙 추가: ${track.kind}`);
      });
    }

    return pc;
  };

  const handleStart = async () => {
    if (!roomId || !userId) return addLog("방 ID와 사용자 ID를 입력하세요");

    // 먼저 미디어 획득
    try {
      console.log(wsUrl);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      addLog("미디어 획득 완료");
    } catch (error) {
      addLog("미디어 획득 실패");
      return;
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      addLog("WebSocket 연결됨");
      ws.send(JSON.stringify({ type: "join", roomId, userId }));
      setConnected(true);
    };

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);

      switch (msg.type) {
        case "start-call":
          await startCaller();
          break;
        case "offer":
          await receiveOffer(msg);
          break;
        case "answer":
          await receiveAnswer(msg);
          break;
        case "ice-candidate":
          if (pcRef.current) {
            try {
              await pcRef.current.addIceCandidate(msg.candidate);
              addLog("ICE candidate 추가 성공");
            } catch (error) {
              addLog(`ICE candidate 추가 실패: ${error}`);
            }
          } else {
            addLog("PeerConnection이 없어서 ICE candidate 무시");
          }
          break;
        case "peer-left":
          handlePeerLeft();
          break;
      }
    };

    ws.onclose = () => addLog("WebSocket 종료");
  };

  const startCaller = async () => {
    // start-call을 받았을 때 PeerConnection 생성
    if (!pcRef.current) {
      const pc = createPeerConnection();
      pcRef.current = pc;
      addLog("Caller PeerConnection 생성");
    }

    addLog("Offer 생성 중...");
    const offer = await pcRef.current.createOffer();
    await pcRef.current.setLocalDescription(offer);

    wsRef.current?.send(
      JSON.stringify({
        type: "offer",
        roomId,
        senderId: userId,
        targetId: getTargetId(),
        offer,
      })
    );
    addLog("Offer 전송 완료");
  };

  const receiveOffer = async (msg: any) => {
    addLog(`Offer 수신 from ${msg.senderId}`);

    // offer를 받았을 때 PeerConnection 생성
    if (!pcRef.current) {
      const pc = createPeerConnection();
      pcRef.current = pc;
      addLog("Callee PeerConnection 생성");
    }

    try {
      addLog("RemoteDescription 설정 중...");
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(msg.offer)
      );
      addLog("RemoteDescription 설정 완료");

      addLog("Answer 생성 중...");
      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);
      addLog("LocalDescription(Answer) 설정 완료");

      wsRef.current?.send(
        JSON.stringify({
          type: "answer",
          roomId,
          senderId: userId,
          targetId: msg.senderId,
          answer,
        })
      );
      addLog("Answer 전송 완료");
    } catch (error) {
      addLog(`Offer 처리 중 오류: ${error}`);
    }
  };

  const receiveAnswer = async (msg: any) => {
    addLog(`Answer 수신 from ${msg.senderId}`);
    if (pcRef.current) {
      try {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(msg.answer)
        );
        addLog("Answer 처리 완료, 연결 협상 중...");
      } catch (error) {
        addLog(`Answer 처리 중 오류: ${error}`);
      }
    } else {
      addLog("PeerConnection이 없어서 Answer 무시");
    }
  };

  const handlePeerLeft = () => {
    addLog("상대방이 나갔습니다");
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (pcRef.current) pcRef.current.close();
  };

  const leave = () => {
    wsRef.current?.send(
      JSON.stringify({
        type: "leave",
        roomId,
        senderId: userId,
        targetId: getTargetId(),
      })
    );
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    pcRef.current?.close();
    wsRef.current?.close();
    setConnected(false);
  };

  useEffect(() => () => leave(), []);

  return (
    <div className="p-4">
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="roomId"
      />
      <input
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="userId"
      />
      <button onClick={handleStart} disabled={connected}>
        입장
      </button>
      <button onClick={leave} disabled={!connected}>
        나가기
      </button>

      <div className="flex space-x-4 mt-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-1/2 border"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-1/2 border"
        />
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg max-h-60 overflow-y-auto">
        <h3 className="font-bold mb-2">연결 로그:</h3>
        {logs.length === 0 ? (
          <div className="text-gray-500">로그가 없습니다</div>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className="text-sm py-1 border-b border-gray-200 last:border-b-0"
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VideoCall;
