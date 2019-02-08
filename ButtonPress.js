var ws = new WebSocket('ws://localhost:8080');

function socketSetup() {
    console.log("Setup")
    ws.onopen = () => {
        console.log("connection opened")
        ws.send('something');
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

export { socketSetup }