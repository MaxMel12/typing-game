//default configs from websocket docs

const config = {
    // The http server instance to attach to.  Required.
    httpServer: null,

    // 64KiB max frame size.
    maxReceivedFrameSize: 0x10000,

    // 1MiB max message size, only applicable if
    // assembleFragments is true
    maxReceivedMessageSize: 0x100000,

    // Outgoing messages larger than fragmentationThreshold will be
    // split into multiple fragments.
    fragmentOutgoingMessages: true,

    // Outgoing frames are fragmented if they exceed this threshold.
    // Default is 16KiB
    fragmentationThreshold: 0x4000,

    // If true, the server will automatically send a ping to all
    // clients every 'keepaliveInterval' milliseconds.  The timer is
    // reset on any received data from the client.
    keepalive: true,

    // The interval to send keepalive pings to connected clients if the
    // connection is idle.  Any received data will reset the counter.
    keepaliveInterval: 20000,

    // If true, the server will consider any connection that has not
    // received any data within the amount of time specified by
    // 'keepaliveGracePeriod' after a keepalive ping has been sent to
    // be dead, and will drop the connection.
    // Ignored if keepalive is false.
    dropConnectionOnKeepaliveTimeout: true,

    // The amount of time to wait after sending a keepalive ping before
    // closing the connection if the connected peer does not respond.
    // Ignored if keepalive is false.
    keepaliveGracePeriod: 10000,

    // Whether to use native TCP keep-alive instead of WebSockets ping
    // and pong packets.  Native TCP keep-alive sends smaller packets
    // on the wire and so uses bandwidth more efficiently.  This may
    // be more important when talking to mobile devices.
    // If this value is set to true, then these values will be ignored:
    //   keepaliveGracePeriod
    //   dropConnectionOnKeepaliveTimeout
    useNativeKeepalive: false,

    // If true, fragmented messages will be automatically assembled
    // and the full message will be emitted via a 'message' event.
    // If false, each frame will be emitted via a 'frame' event and
    // the application will be responsible for aggregating multiple
    // fragmented frames.  Single-frame messages will emit a 'message'
    // event in addition to the 'frame' event.
    // Most users will want to leave this set to 'true'
    assembleFragments: true,

    // If this is true, websocket connections will be accepted
    // regardless of the path and protocol specified by the client.
    // The protocol accepted will be the first that was requested
    // by the client.  Clients from any origin will be accepted.
    // This should only be used in the simplest of cases.  You should
    // probably leave this set to 'false' and inspect the request
    // object to make sure it's acceptable before accepting it.
    autoAcceptConnections: false,

    // Whether or not the X-Forwarded-For header should be respected.
    // It's important to set this to 'true' when accepting connections
    // from untrusted clients, as a malicious client could spoof its
    // IP address by simply setting this header.  It's meant to be added
    // by a trusted proxy or other intermediary within your own
    // infrastructure.
    // See:  http://en.wikipedia.org/wiki/X-Forwarded-For
    ignoreXForwardedFor: false,

    // If this is true, 'cookie' headers are parsed and exposed as WebSocketRequest.cookies
    parseCookies: true,

    // If this is true, 'sec-websocket-extensions' headers are parsed and exposed as WebSocketRequest.requestedExtensions
    parseExtensions: true,

    // The Nagle Algorithm makes more efficient use of network resources
    // by introducing a small delay before sending small packets so that
    // multiple messages can be batched together before going onto the
    // wire.  This however comes at the cost of latency, so the default
    // is to disable it.  If you don't need low latency and are streaming
    // lots of small messages, you can change this to 'false'
    disableNagleAlgorithm: true,

    // The number of milliseconds to wait after sending a close frame
    // for an acknowledgement to come back before giving up and just
    // closing the socket.
    closeTimeout: 5000
};


exports.config = config