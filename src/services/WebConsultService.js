// src/services/WebConsultService.js
import axios from "axios";
import { HttpsProxyAgent } from 'https-proxy-agent';
import logger from '../logger.js';

class WebConsultService {
  constructor() {
    // Inicializar el agente proxy si es necesario
    this.proxyAgent = new HttpsProxyAgent('http://brd-customer-hl_126387b7-zone-datacenter_proxy1-country-ar:3c3kgjlir2q9@brd.superproxy.io:22225'); // Reemplaza con tu proxy real
  }


  async requestP2P(asset, fiat, payTypes, tradeType) {

  //const proxyAgent = new HttpsProxyAgent('http://brd-customer-hl_126387b7-zone-datacenter_proxy1-country-ar:3c3kgjlir2q9@brd.superproxy.io:22225'); // Reemplaza con tu proxy real
 


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
          httpsAgent: this.proxyAgent

        }
      );

      console.log(response.data)
      logger.info('P2P data fetched successfully from Binance.');
      return response.data;
    } catch (error) {
      logger.error('Error requesting P2P data from Binance:'+ error);
      throw error;
    }
  }
}

export default new WebConsultService();
