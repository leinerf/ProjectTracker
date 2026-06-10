import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";

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
// app.use(cors());



//setup env variables
const port = process.env.PORT;

app.use("/auth", authRouter(db));
// app.use("/api", expressjwt({ secret: process.env.JWT_SECRET, algorithms: [process.env.JWT_ALGO] }), )

app.use("/api", jwtWrapper(), apiRouter(db));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});