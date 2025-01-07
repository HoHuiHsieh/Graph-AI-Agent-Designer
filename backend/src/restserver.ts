/**
 * Add MyRestServer class with CORS setup and middleware configurations.
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import express, { Express, Router } from "express";
import cors from "cors";


/**
 * Add MyRestServer class 
 */
export default class MyRestServer {

    private http: Express
    private PORT = 3000

    constructor() {
        this.http = express();
        this.middlewares();
    }

    /**
     * add CORS setup and middlewares for HTTP requests
     */
    private middlewares() {
        // CORS setup
        this.http.use(cors({
            "allowedHeaders": ["Content-Type", "Authorization"],
            "origin": "*",
            "methods": "GET,POST",
            "credentials": false,
            "preflightContinue": false
        }
        ));

        this.http.use(express.json({ limit: "50mb" }));
        this.http.use(express.urlencoded({ extended: true }));
        this.http.disable("x-powered-by");
    }

    /**
     * set up routes and start http server
     * @param routers 
     * @returns 
     */
    listen(routers: Router[]) {
        // route paths
        routers.forEach((router) => {
            this.http.use("/app", router);
        })
        // return server
        return this.http.listen(this.PORT, () => {
            console.log(`HTTP server is listening on port ${this.PORT}`);
        });
    }
}
