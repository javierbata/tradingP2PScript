// src/controllers/DBController.js
import db from '../config/db.js';
import logger from '../logger.js';

class DBController {
  async storeDataInDB(data) {
    if (!data || data.length === 0) {
      logger.warn('No data provided to store in the database.');
      return;
    }

    try {
      // Validar y asignar IDs para entidades relacionadas
      await this.validateAndAssignIDs(data);

      // Registrar usuarios
      await this.registerUsers(data);

      // Registrar publicaciones
      await this.registerPosts(data);

      logger.info('Data stored in the database successfully.');
    } catch (error) {
      logger.error('Error storing data in the database:', error.message);
      throw error;
    }
  }

  async validateAndAssignIDs(data) {
    // Extraer tipos únicos de criptomonedas, monedas y bancos
    const uniqueCryptoTypes = [...new Set(data.map(item => item.cryptoType))];
    const uniqueCurrencyTypes = [...new Set(data.map(item => item.currencyType))];
    const uniqueBankTypes = [...new Set(data.map(item => `${item.bankName}-${item.currencyType}`))];

    // Validar Tipos de Criptomonedas
    const cryptoTypes = await this.fetchAll('CryptoTypes');
    uniqueCryptoTypes.forEach(crypto => {
      if (!cryptoTypes.find(ct => ct.CryptoName === crypto)) {
        // Insertar nuevo tipo de criptomoneda
        // Implementar insertCryptoType si es necesario
      }
    });

    // Validar Tipos de Moneda
    const currencyTypes = await this.fetchAll('CurrencyTypes');
    uniqueCurrencyTypes.forEach(currency => {
      if (!currencyTypes.find(ct => ct.CurrencyName === currency)) {
        // Insertar nuevo tipo de moneda
        // Implementar insertCurrencyType si es necesario
      }
    });

    // Validar Tipos de Banco
    const bankTypes = await this.fetchAll('BankTypes');
    uniqueBankTypes.forEach(bank => {
      const [bankName, currencyType] = bank.split('-');
      const currencyId = this.getCurrencyTypeId(currencyType);
      if (!bankTypes.find(bt => bt.BankName === bankName && bt.CurrencyTypeId === currencyId)) {
        // Insertar nuevo tipo de banco
        // Implementar insertBankType si es necesario
      }
    });
  }

  async fetchAll(table) {
    const query = `SELECT * FROM ${table}`;
    let connection = await db.getConnection();

    try {
      const results = await this.executeQuery(connection, query);
      return results;
    } catch (error) {
      logger.error(`Error fetching data from ${table}:`, error.message);
      throw error;
    } finally {
      await connection.release();
    }
  }

  getCurrencyTypeId(currencyType) {
    // Implementar lógica para obtener currencyTypeId basado en currencyType
    // Puede ser una consulta adicional o utilizar una caché
    return null;
  }

  async registerUsers(data) {
    const querySelect = 'SELECT * FROM Users WHERE CodeName = ?';
    const queryInsert = 'INSERT INTO Users (UserName, MerchantType, CodeName, Date) VALUES (?, ?, ?, ?)';

    for (let item of data) {
      try {
        let connection = await db.getConnection();
        const existingUsers = await this.executeQuery(connection, querySelect, [item.userCode]);

        if (existingUsers.length === 0) {
          const insertResult = await this.executeQuery(connection, queryInsert, [item.userName, item.userType, item.userCode, item.date]);
          item.userId = insertResult.insertId;
          logger.info(`User created with ID: ${item.userId}`);
        } else {
          item.userId = existingUsers[0].Id;
          logger.info(`User exists with ID: ${item.userId}`);
        }

        await connection.release();
      } catch (error) {
        logger.error('Error registering user:', error.message);
        throw error;
      }
    }
  }

  async registerPosts(data) {
    const queryInsert = `INSERT INTO Posts (UserId, PostedPrice, AvailableAmount, MinAmount, MaxAmount, 
      BankTypeId, CryptoTypeId, OrderTypeId, PostDate, OrderCount, CompletionRate, LikeCount) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    let connection = await db.getConnection();

    try {
      for (let item of data) {
        const orderType = item.orderType === 'BUY' ? 1 : 0;
        const params = [
          item.userId,
          item.postedPrice,
          item.availableAmount,
          item.minAmount,
          item.maxAmount,
          item.bankTypeId,
          item.cryptoTypeId,
          orderType,
          new Date(item.date),
          item.orderCount,
          item.completionRate,
          item.likeCount
        ];

        await this.executeQuery(connection, queryInsert, params);
        logger.info(`Post created for user ID: ${item.userId}`);
      }
    } catch (error) {
      logger.error('Error registering posts:', error.message);
      throw error;
    } finally {
      await connection.release();
    }
  }

  executeQuery(connection, sql, values = []) {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

export default DBController;
