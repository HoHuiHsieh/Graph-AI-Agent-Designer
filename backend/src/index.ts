/**
 * Validate environment variable and initialize REST and WebSocket servers.
  * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { cleanEnv, str, } from "envalid";
import runWorkFlow from "./Workflow";
import MyRestServer from "./restserver";
import MyWebSockerServer from "./websocket";
import { routers } from "./Router";


// check environment variables 
cleanEnv(process.env, {
  TWCC_API_URL: str(),
  TWCC_API_KEY: str(),
});

// start services
const http = new MyRestServer();
const http_server = http.listen(routers);
const wss = new MyWebSockerServer(http_server, runWorkFlow);

