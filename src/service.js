const ws = new WebSocket("ws://localhost:3000");

export default {
    wxMetrics() {
        ws.addEventListener("open", () => {
            ws.send("front-end: Hi.");
        });

        ws.addEventListener("message", (res) => {
            console.log('message', res)
        });

        ws.addEventListener("error", (error) => {
            console.log("error", error);
        });

        ws.addEventListener("close", (error) => {
            console.log("close");
        });
    }
}