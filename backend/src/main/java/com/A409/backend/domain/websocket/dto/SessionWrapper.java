package com.A409.backend.domain.websocket.dto;

import org.kurento.client.MediaPipeline;
import org.kurento.client.WebRtcEndpoint;
import org.springframework.web.socket.WebSocketSession;

public class SessionWrapper {

    private final WebSocketSession wsSession;
    private final MediaPipeline pipeline;
    private final WebRtcEndpoint webRtc;

    public SessionWrapper(WebSocketSession wsSession,
                          MediaPipeline pipeline,
                          WebRtcEndpoint webRtc) {
        this.wsSession = wsSession;
        this.pipeline = pipeline;
        this.webRtc = webRtc;
    }

    public WebSocketSession getWsSession() {
        return wsSession;
    }

    public MediaPipeline getPipeline() {
        return pipeline;
    }

    public WebRtcEndpoint getWebRtc() {
        return webRtc;
    }

    public void close() {
        if (webRtc != null) {
            webRtc.release();
        }
        if (pipeline != null) {
            pipeline.release();
        }
    }
}