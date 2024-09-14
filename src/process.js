// src/index.js
import BinanceController from './controllers/BinanceController.js';
import DBController from './controllers/DBController.js';
import DBControllerGET from './controllers/DBControllerGET.js';
import logger from './logger.js';
import cron from 'node-cron';

async function main() {
  const binanceController = new BinanceController();
  const dbController = new DBController();
  const dbControllerGET = new DBControllerGET();

  try {
    // Programar la tarea para que se ejecute cada minuto
    cron.schedule('* * * * *', async () => {
      try {
        logger.info('Fetching and storing Binance data...');
        const data1 = await binanceController.fetchAndStoreData("USDT", "VES", "Banesco", "SELL");
        await dbController.storeDataInDB(data1);

        const data2 = await binanceController.fetchAndStoreData("USDT", "VES", "SpecificBank", "SELL");
        await dbController.storeDataInDB(data2);

        const data3 = await binanceController.fetchAndStoreData("USDT", "VES", "Mercantil", "SELL");
        await dbController.storeDataInDB(data3);

        const data4 = await binanceController.fetchAndStoreData("USDT", "VES", "Provincial", "SELL");
        await dbController.storeDataInDB(data4);

        logger.info('Binance data fetched and stored successfully.');
      } catch (error) {
        logger.error('Error during scheduled data fetch and store:', error.message);
      }
    });

    // Obtención inicial de datos
    const initialData = await binanceController.fetchAndStoreData("USDT", "VES", "Banesco", "SELL");
    await dbController.storeDataInDB(initialData);
    logger.info('Initial Binance data fetched and stored successfully.');
  } catch (error) {
    logger.error('Application error:', error.message);
  }
}

main();
