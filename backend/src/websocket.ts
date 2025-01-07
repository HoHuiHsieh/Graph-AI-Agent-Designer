/**
 * add MyWebSockerServer class for handling WebSocket connections
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { Server as SocketServer } from "socket.io";


/**
 * Add MyWebSockerServer class
 */
export default class MyWebSockerServer {

    private wss: SocketServer;
    private app: any

    constructor(http_server: any, run: any) {
        this.wss = new SocketServer(http_server);
        this.app = run;
        this.bind();
    }

    /**
     * WebSocket connection handling
     */
    private bind() {
        this.wss.on("connection", (ws) => {
            console.log("Client connected")

            ws.on("message", (data) => {
                this.app(data.toString(), ws)
            })

            ws.on("close", () => {
                console.log("Close connected")
            })
        })
    }
}