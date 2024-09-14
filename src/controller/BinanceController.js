// src/controllers/BinanceController.js
import webConsultService from '../services/WebConsultService.js';
import logger from '../logger.js';

class BinanceController {
  async fetchAndStoreData(crypto, currency, bank, orderType) {
    try {
      logger.info(`Fetching data from Binance for ${crypto}-${currency} at ${bank} with order type ${orderType}.`);
      const binanceData = await webConsultService.requestP2P(crypto, currency, [bank], orderType);

      const dataArray = binanceData.data.map(item => ({
        userCode: item.advertiser.userNo,
        userName: item.advertiser.nickName,
        userType: item.advertiser.userGrade,
        orderCount: item.advertiser.monthOrderCount,
        completionRate: item.advertiser.monthFinishRate,
        likeCount: item.advertiser.positiveRate,
        postedPrice: parseFloat(item.adv.price),
        availableAmount: parseFloat(item.adv.surplusAmount),
        minAmount: parseFloat(item.adv.minSingleTransAmount),
        maxAmount: parseFloat(item.adv.maxSingleTransAmount),
        bankName: bank,
        orderType: orderType,
        currencyType: item.adv.fiatUnit,
        cryptoType: item.adv.asset,
        date: new Date().toISOString()
      }));

      if (dataArray.length === 0) {
        logger.warn("No data fetched from Binance.");
        return [];
      } else {
        logger.info(`${dataArray.length} records fetched from Binance.`);
        return dataArray;
      }
    } catch (error) {
      logger.error('Error fetching data from Binance:', error.message);
      return [];
    }
  }
}

export default BinanceController;
