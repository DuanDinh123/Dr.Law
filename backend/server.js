
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";

import router from "./router";
import { connectDB } from "./src/config/connect.js";
import updateWarningSupplie from "./src/middleware/update-warning-supplie.middleware";
import { generateMiddleware } from "./src/utilities/generateMiddleware";
import { initDb } from "./src/utilities/initDb";

dotenv.config();
const store = session.MemoryStore();
const app = express();

app.use(cookieParser());
app.use(session({
  saveUninitialized: false,
  secret: process.env.KEY_SESSION,
  cookie: {
    // 10s
    maxAge: 1000 * 20
  },
  store
}));
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(helmet());
app.use(morgan("common"));
app.use(cors());

generateMiddleware();

connectDB().then(() => {
  initDb().then(() => {

    app.get("/", async (req, res) => {
      res.send("Hello World!");
    });

    //Router
    app.use("/", router);

    app.use(updateWarningSupplie);

    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Starting on port ${process.env.PORT}!`);
    });
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
});



