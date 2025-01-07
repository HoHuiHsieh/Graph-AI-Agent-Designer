/**
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import { cleanEnv, str, } from "envalid";
import MyRestServer from "./restserver";
import { routers } from "./Router";
// import MyWebSockerServer from "./websocket";
// import { runSocketWorkFlow } from "./Workflow";


// check environment variables 
cleanEnv(process.env, {
  OPENAI_API_KEY: str(),
});

// start services
const http = new MyRestServer();
const http_server = http.listen(routers);
// const wss = new MyWebSockerServer(http_server, runSocketWorkFlow);

