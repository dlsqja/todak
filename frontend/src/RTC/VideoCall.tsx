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

  const wsUrl = "ws://localhost:8080/ws";
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

  const addLog = (msg: string) =>
    setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()} ${msg}`]);

  const getTargetId = () => (userId === "user1" ? "user2" : "user1");

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(stunTurn);

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            roomId,
            senderId: userId,
            targetId: getTargetId(),
            candidate: event.candidate,
          })
        );
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  const handleStart = async () => {
    if (!roomId || !userId) return addLog("방 ID와 사용자 ID를 입력하세요");

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
          if (pcRef.current) await pcRef.current.addIceCandidate(msg.candidate);
          break;
        case "peer-left":
          handlePeerLeft();
          break;
      }
    };

    ws.onclose = () => addLog("WebSocket 종료");
  };

  const startCaller = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    pcRef.current = pc;

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    wsRef.current?.send(
      JSON.stringify({
        type: "offer",
        roomId,
        senderId: userId,
        targetId: getTargetId(),
        offer,
      })
    );
  };

  const receiveOffer = async (msg: any) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;

    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
    pcRef.current = pc;

    await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    wsRef.current?.send(
      JSON.stringify({
        type: "answer",
        roomId,
        senderId: userId,
        targetId: msg.senderId,
        answer,
      })
    );
  };

  const receiveAnswer = async (msg: any) => {
    if (pcRef.current) {
      await pcRef.current.setRemoteDescription(
        new RTCSessionDescription(msg.answer)
      );
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

      <div className="mt-4">
        {logs.map((log, idx) => (
          <div key={idx}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default VideoCall;
