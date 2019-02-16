var ws = new WebSocket('ws://10.1.250.128:8000');

function socketSetup() {
    console.log("Setup")
    ws.onopen = () => {
        console.log("connection opened")
    }

    ws.onmessage = (e) => {
        console.log("message")
        // a message was received
        console.log(e.data);
    };

    ws.onerror = (e) => {
        // an error occurred
        console.log("error")
        console.log(e.message);
    };

    ws.onclose = (e) => {
        // connection closed
        console.log("closing");
        console.log(e.code, e.reason);
    };
}

function send(msg) {
    ws.send(JSON.stringify(msg))
}

export { socketSetup, send }