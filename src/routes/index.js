import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../logger.js';
import fetch from 'node-fetch';
import config from "../config.js";
// Importar routers
import usersRouter from './usersRouter.js';
import postsRouter from './postsRouter.js';
import cryptoTypesRouter from './cryptoTypesRouter.js';
import bankTypesRouter from './bankTypesRouter.js';
import currencyTypesRouter from './currencyTypesRouter.js';

const app = express();
app.use(bodyParser.json());

// Define rutas principales
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/crypto-types", cryptoTypesRouter);
app.use("/bank-types", bankTypesRouter);
app.use("/currency-types", currencyTypesRouter);

// Rutas de páginas de ejemplo
app.get("/", (req, res) => {
  logger.info("Accessed / route");
  try {
    res.status(200).json({ message: 'Consulta exitosa' });
  } catch (error) {
    logger.error('Error al obtener consulta principal:', error);
    res.status(500).json({ message: 'Error al obtener la consulta principal', error: error.message });
  }
});

// Ruta para descargar log
app.get('/download-log', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logFilePath = path.join(__dirname, '../logs', 'combined.log'); // Ruta al archivo de log
  res.download(logFilePath, 'combined.log', (err) => {
    if (err) {
      logger.error('Error al descargar el archivo de log:', err);
      res.status(500).send('Error al descargar el archivo de log');
    } else {
      logger.info("Log file downloaded successfully");
    }
  });
});

// Keep-alive
const url = config.BACKENDNUBE;  // URL del endpoint de tu aplicación
const interval = 300000;  // Intervalo de tiempo en milisegundos (5 minutos)

const keepAlive = async () => {
  try {
    const response = await fetch(url);
    logger.info(`Keep-alive ping status: ${response.status}`);
  } catch (error) {
    logger.error(`Keep-alive ping error: ${error.message}`);
  }
};

// Ejecuta el keepAlive cada 5 minutos
setInterval(keepAlive, interval);

// Llama al keepAlive inmediatamente al iniciar la aplicación
keepAlive();

export default app;
