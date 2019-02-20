var ws = new WebSocket('ws://10.1.250.128:8000');

function socketSetup() {
    ws.onopen = () => {
        console.log("connection opened")
    }

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

    ws.onmessage = (e) => {
        console.log("message received")
        // a message was received
        console.log(e.data);
    };
}

function send(msg) {
    ws.send(JSON.stringify(msg))
}

export { socketSetup, send}