import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Configurar transporte para rotar archivos de log
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',   // Nombre del archivo de log con formato de fecha
  datePattern: 'YYYY-MM-DD-HH',           // Patrón de fecha para crear archivos de log
  maxSize: '2',                        // Tamaño máximo por archivo (100 MB)
  maxFiles: '14d',                        // Mantener logs por los últimos 14 días
  zippedArchive: true                     // Comprimir archivos de log antiguos
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }),  // Solo para errores
    dailyRotateFileTransport,                                             // Rotación automática de logs
    new transports.Console()                                              // Mostrar logs en la consola
  ]
});

export default logger;