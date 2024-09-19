import { config } from "dotenv";
config();
//const datebase = 'jaenvios_2024-06-13-PRUEBA'
const datebase = 'jaenvios'
export default {
  PORT: process.env.PORT || 8080,
  APPID: process.env.APPID || "",
  BD: {
    user: 'javierbata',
    password: 'Aaron.30',
    server: 'jaenviossql.database.windows.net',
    database: datebase,
    options: {
      encrypt: true, // Si estás utilizando Azure, establece esto en true
    },
    pool: {
      max: 10, // Máximo número de conexiones en el pool
      min: 0, // Mínimo número de conexiones en el pool
      idleTimeoutMillis: 30000, // Tiempo máximo que una conexión puede estar inactiva antes de ser cerrada
      acquireTimeoutMillis: 15000, // Tiempo máximo que se intentará adquirir una conexión antes de lanzar un error
    },
    requestTimeout: 30000 // Timeout en milisegundos para las consultas
  },
  URLCONNECTIONCONTAINER : "DefaultEndpointsProtocol=https;AccountName=jaenvioswebstorageimagen;AccountKey=hEO06KvLdbQGX5USMRL1/wbW/hVBzw4uT1VkLAZ16+fl19pU+nWIOBWLBAuRZ82m2lBLg3sjl4QO+AStFpX+Jg==;EndpointSuffix=core.windows.net",
  CANTAINERNAME : "documentimage",
  BACKENDNUBE:  "https://jaenvioswebbackend.azurewebsites.net",
  BACKENDLOCAL: "http://localhost:5000"

};