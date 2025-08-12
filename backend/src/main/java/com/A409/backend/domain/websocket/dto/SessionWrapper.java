package com.A409.backend.domain.websocket.dto;

import lombok.Getter;
import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.springframework.web.socket.WebSocketSession;

@Getter
public class SessionWrapper {

    private final WebSocketSession wsSession;
    private final MediaPipeline pipeline;
    private final WebRtcEndpoint webRtc;
    private final WebRtcEndpoint sttEp;

    public SessionWrapper(WebSocketSession wsSession,
                          MediaPipeline pipeline,
                          WebRtcEndpoint webRtc,
                          WebRtcEndpoint sttEp) {
        this.wsSession = wsSession;
        this.pipeline = pipeline;
        this.webRtc = webRtc;
        this.sttEp = sttEp;
    }

    public void close() {
        if (webRtc != null) {
            webRtc.release();
        }
//        if (pipeline != null) {
//            pipeline.release();
//        }
        if (sttEp != null) {
            sttEp.release();
        }
    }
}