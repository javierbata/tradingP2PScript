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

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    logger.info('Connected to MSSQL');
    return pool;
  })
  .catch(err => logger.error('Database Connection Failed!', err));

export default {
  getConnection: async () => {
    try {
      const pool = await poolPromise;
      return pool;
    } catch (error) {
      logger.error('Error getting DB connection:', error.message);
      throw error;
    }
  }
};