import { config } from "dotenv";
config();
const datebase = 'P2PBinance'
//const datebase = 'jaenvios'
export default {
  PORT: process.env.PORT || 5000,
  APPID: process.env.APPID || "",
  BD: {
    user: 'javierbata',
    password: 'Aaron.30',
    server: 'tradingp2p.database.windows.net',
    database: datebase,
    options: {
      encrypt: true, // Si estás utilizando Azure, establece esto en true
    },
  },

  
  BACKENDNUBE:  "https://botluiscasanova.azurewebsites.net/",
  BACKENDLOCAL: "http://localhost:5000"

};
