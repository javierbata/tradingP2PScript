// src/services/WebConsultService.js
import axios from "axios";
import { HttpsProxyAgent } from 'https-proxy-agent';
import logger from '../logger.js';

class WebConsultService {
  constructor() {
    // Inicializar el agente proxy si es necesario
    this.proxyAgent = new HttpsProxyAgent('http://your-proxy:port'); // Reemplaza con tu proxy real
  }

  async requestP2P(asset, fiat, payTypes, tradeType) {
    logger.info(`Making P2P request to Binance for ${asset}-${fiat} with trade type ${tradeType}.`);
    const body = {
      asset: asset,
      countries: [],
      fiat: fiat,
      page: 1,
      payTypes: payTypes,
      proMerchantAds: false,
      publisherType: null,
      rows: 10,
      tradeType: tradeType
    };

    try {
      const response = await axios.post(
        "https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search",
        body,
        {
          httpsAgent: this.proxyAgent,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      logger.info('P2P data fetched successfully from Binance.');
      return response.data;
    } catch (error) {
      logger.error('Error requesting P2P data from Binance:', error.message);
      throw error;
    }
  }
}

export default new WebConsultService();
