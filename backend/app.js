import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from 'node:path'
import appConfig from "./config.js";

//import db
import db from "./db/index.js";

//import routes
import authRouter from "./routes/authenticate.js";
import apiRouter from "./routes/api.js";

//custom middleware
import jwtWrapper from "./middleware/jwtWrapper.js";


//setup app
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

//create path for static build for app
const __dirname = path.dirname(
    import.meta.dirname)
const frontendFile = path.join(__dirname, appConfig.frontendBuild)
const assets = path.join(path.dirname(frontendFile), "assets");


//setup env variables
const port = appConfig.port;
app.use("/auth", authRouter(db));
app.use("/api", jwtWrapper(), apiRouter(db));
app.use(express.static(path.dirname(frontendFile)))

app.get('/*path', (req, res) => {
    return res.sendFile(frontendFile);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});