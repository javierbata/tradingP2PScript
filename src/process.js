// src/index.js
import BinanceController from './controller/BinanceController.js';
import DBController from './controller/DBController.js';
import DBControllerGET from './controller/DBControllerGET.js';
import logger from './logger.js';
import cron from 'node-cron';


class Process {

 async start() {
  const binanceController = new BinanceController();
  const dbController = new DBController();
  const dbControllerGET = new DBControllerGET();

  try {
    // Programar la tarea para que se ejecute cada minuto
    cron.schedule('* * * * *', async () => {
      try {
        logger.info('Fetching and storing Binance data...');

        await dbController.storeDataInDB(await binanceController.fetchAndStoreData("USDT", "VES", "Banesco", "SELL"));
        await dbController.storeDataInDB( await binanceController.fetchAndStoreData("USDT", "VES", "SpecificBank", "SELL"));
        await dbController.storeDataInDB(await binanceController.fetchAndStoreData("USDT", "VES", "Mercantil", "SELL"));
        await dbController.storeDataInDB(await binanceController.fetchAndStoreData("USDT", "VES", "Provincial", "SELL"));
        // peru
      
         await dbController.storeDataInDB(await binanceController.fetchAndStoreData("USDT", "PEN", "CreditBankofPeru", "BUY"));
         await dbController.storeDataInDB(await binanceController.fetchAndStoreData("USDT", "PEN", "CreditBankofPeru", "SELL"));
         await dbController.storeDataInDB(await binanceController.fetchAndStoreData("USDT", "USD", "CreditBankofPeru", "BUY"));
         await dbController.storeDataInDB(await binanceController.fetchAndStoreData("USDT", "USD", "CreditBankofPeru", "SELL"));

        logger.info('Binance data fetched and stored successfully.');
      } catch (error) {
        logger.error('Error during scheduled data fetch and store:', error.message);
      }
    });

    // Obtención inicial de datos
    const initialData = await binanceController.fetchAndStoreData("USDT", "PEN", "CreditBankofPeru", "BUY");
    await dbController.storeDataInDB(initialData);
    logger.info('Initial Binance data fetched and stored successfully.');
  } catch (error) {
    logger.error('Application error:', error.message);
  }
}
}
export default new Process();