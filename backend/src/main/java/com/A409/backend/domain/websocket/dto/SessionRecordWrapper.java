package com.A409.backend.domain.websocket.dto;

import lombok.Getter;
import org.kurento.client.MediaPipeline;
import org.kurento.client.RecorderEndpoint;
import org.kurento.client.WebRtcEndpoint;
import org.springframework.web.socket.WebSocketSession;

@Getter
public class SessionRecordWrapper {

    private final WebSocketSession wsSession;
    private final MediaPipeline pipeline;
    private final WebRtcEndpoint webRtc;
    private final RecorderEndpoint recorder;

    public SessionRecordWrapper(WebSocketSession wsSession,
                                MediaPipeline pipeline,
                                WebRtcEndpoint webRtc,
                                RecorderEndpoint recorder) {
        this.wsSession = wsSession;
        this.pipeline = pipeline;
        this.webRtc = webRtc;
        this.recorder = recorder;
    }

    public void close() {
        if (recorder != null) {
            recorder.stop();
            recorder.release();
        }
        if (webRtc != null) {
            webRtc.release();
        }
//        if (pipeline != null) {
//            pipeline.release();
//        }
    }
}