import express from "express";
import path from "path";
import morgan from "morgan";
import routes from "./routes/index.js";
import bodyParser from 'body-parser';
import expressWs from 'express-ws';

import config from "./config.js";

import {fileURLToPath} from "url";

const app = express();

expressWs(app); // Configura express-ws con la aplicación Express
const __dirname = path.dirname(fileURLToPath(import.meta.url));



// Settings
app.set("port", config.PORT);
//app.set("views", path.resolve(__dirname, "views"));
//app.set("view engine", "ejs");

app.use(bodyParser.json({ limit: '50mb' }));
// Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));




// global variables
app.use((req, res, next) => {
  console.log(config.APPID)
  app.locals.APPID = config.APPID;
  next();
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


app.use(routes);

app.use(express.static(path.join(__dirname, "public")));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

export default app;
