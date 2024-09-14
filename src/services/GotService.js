// src/services/GotService.js
import got from "got";
import logger from '../logger.js';

class GotService {
  async makeRequest(type, url, options) {
    try {
      const response = await got[type](url, options);
      return response.body;
    } catch (error) {
      logger.error(`Error making ${type} request to ${url}:`, error.message);
      throw error;
    }
  }
}

export default new GotService();
