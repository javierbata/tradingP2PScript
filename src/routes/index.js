import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../logger.js';
import fetch from 'node-fetch';
import config from "../config.js";
import process from "../process.js";

// Importar routers

const app = express();
app.use(bodyParser.json());

// Define rutas principales
process.start()

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
  const logDirectory = path.join(__dirname, '../../logs'); // Directorio donde están los logs

  // Obtener el archivo de log más reciente
  fs.readdir(logDirectory, (err, files) => {
    if (err) {
      logger.error('Error al leer el directorio de logs:', err);
      return res.status(500).send('Error al leer el directorio de logs');
    }

    // Filtrar solo archivos que siguen el patrón de log rotado
    const logFiles = files.filter(file => file.startsWith('combined-') && file.endsWith('.log'));

    if (logFiles.length === 0) {
      return res.status(404).send('No se encontró ningún archivo de log');
    }

    // Ordenar archivos por fecha de creación (nombre) y obtener el más reciente
    logFiles.sort();
    const latestLogFile = logFiles[logFiles.length - 1]; // Último archivo

    const logFilePath = path.join(logDirectory, latestLogFile);

    // Descargar el archivo más reciente
    res.download(logFilePath, latestLogFile, (err) => {
      if (err) {
        logger.error('Error al descargar el archivo de log:', err);
        res.status(500).send('Error al descargar el archivo de log');
      } else {
        logger.info("Archivo de log descargado exitosamente.");
      }
    });
  });
});

app.get('/download-log-beta', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logFilePath = path.join(__dirname, '../../logs', 'combined.log'); // Ruta al archivo de log
  res.download(logFilePath, 'combined.log', (err) => {
    if (err) {
      logger.error('Error al descargar el archivo de log:', err);
      res.status(500).send('Error al descar gar el archivo de log');
    } else {
      logger.info("Log file downloaded successfully");
    }
  });
});

app.get('/delete-log', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const logFilePath = path.join(__dirname, '../../logs', 'combined.log'); // Ruta al archivo de log
  fs.unlink(logFilePath, (err) => {
    if (err) {
      res.status(200).json({ message: 'Error al eliminar el archivo de log' });
    } else {
      logger.info("Archivo de log eliminado exitosamente.");
      res.status(200).json({ message: 'Archivo de log eliminado exitosamente' });
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
