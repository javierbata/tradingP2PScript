// src/services/APIService.js
import axios from 'axios';
import logger from '../logger.js';
import config from '../config.js';


class APIService {

   
  constructor() {
    this.apiClient = axios.create({

      baseURL: config.BACKENDNUBE, // URL base de tu API de backend
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }



    // Método para obtener un tipo de cripto por nombre
    async getCryptoTypeAll() {
        try {
          const response = await this.apiClient.get('/crypto-types');

          if (response.data.result.length > 0) {
            logger.info(`CryptoType found all`);
            return response.data;
          } else {
            return null;
          }
        } catch (error) {
          logger.error('Error fetching crypto type:', error.response ? error.response.data : error.message);
          throw error;
        }
      }

      async getCurrencyTypesAll() {
        try {
          const response = await this.apiClient.get('/currency-types');

          if (response.data.result.length > 0) {
            logger.info(`CurrencyTypes found all`);
            return response.data;
          } else {
            return null;
          }
        } catch (error) {
          logger.error('Error fetching Currency type:', error.response ? error.response.data : error.message);
          throw error;
        }
      }

      async getBankTypesAll() {
        try {
          const response = await this.apiClient.get('/bank-types');
 
          if (response.data.result.length > 0) {
            logger.info(`BankType found all`);
            return response.data;
          } else {
            return null;
          }
        } catch (error) {
          logger.error('Error fetching Bank type:', error.response ? error.response.data : error.message);
          throw error;
        }
      }
     

      async getUserByCodeName(codeName) {
        try {
          const response = await this.apiClient.get('/users/name-code',codeName);
   
          if (response.data) {
            logger.info(`getUserByCodeName found all`);
            return response.data;
          } else {
            return null;
          }
        } catch (error) {
          logger.error('Error fetching Bank type:', error.response ? error.response.data : error.message);
          throw error;
        }
      }


  async createUser(userData) {
    try {
      console.log("createUser" + userData)
      const response = await this.apiClient.post('/users', userData);
      logger.info(`User created with ID: ${response.data.result.userId}`);
      return response;
    } catch (error) {
      logger.error('Error creating user:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async createCryptoType(cryptoData) {
    try {
      const response = await this.apiClient.post('/crypto-types', cryptoData);
      logger.info(`CryptoType created with ID: ${response.data.result.cryptoTypeId}`);
      return response.data.result.cryptoTypeId;
    } catch (error) {
      logger.error('Error creating crypto type:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async createCurrencyType(currencyData) {
    try {
      const response = await this.apiClient.post('/currency-types', currencyData);
      logger.info(`CurrencyType created with ID: ${response.data.result.currencyTypeId}`);
      return response.data.result.currencyTypeId;
    } catch (error) {
      logger.error('Error creating currency type:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async createBankType(bankData) {
    try {
      const response = await this.apiClient.post('/bank-types', bankData);
      logger.info(`BankType created with ID: ${response.data.result.bankTypeId}`);
      return response.data.result.bankTypeId;
    } catch (error) {
      logger.error('Error creating bank type:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  async createPost(postData) {
    try {
      const response = await this.apiClient.post('/posts', postData);
      logger.info(`Post created with ID: ${response.data.result.postId}`);
      return response.data.result.postId;
    } catch (error) {
      logger.error('Error creating post:', error.response ? error.response.data : error.message);
      throw error;
    }
  }

  // Agrega más métodos según sea necesario para otros endpoints de la API
}

export default new APIService();
