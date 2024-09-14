// controllers/BankTypesController.js
import sql from 'mssql';
import config from "../config.js";
import logger from '../logger.js';

const configBD = config.BD;

class BankTypesController {
  
  // Crear un nuevo tipo de banco
  postBankType = async (req, res) => {
    const { currencyTypeId, bankName } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para registrar un tipo de banco.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para registrar el tipo de banco.');

        const request = new sql.Request(transaction);
        request.input('currencyTypeId', sql.Int, currencyTypeId);
        request.input('bankName', sql.NVarChar, bankName);

        let query = `
          INSERT INTO BankTypes (CurrencyTypeId, BankName) 
          OUTPUT INSERTED.Id 
          VALUES (@currencyTypeId, @bankName)`;

        const result = await request.query(query);
        const bankTypeId = result.recordset[0].Id;

        await transaction.commit();
        logger.info(`Registro exitoso del tipo de banco con ID: ${bankTypeId}`);
        res.status(200).json({ mensaje: 'Registro exitoso', result: { bankTypeId } });
      } catch (innerError) {
        await transaction.rollback();
        logger.error('Error al ejecutar la transacción:', innerError);
        res.status(500).json({ mensaje: 'Error inesperado al procesar la solicitud', error: innerError.message });
      }
    } catch (error) {
      logger.error('Error al conectar con la base de datos:', error);
      res.status(500).json({ mensaje: 'Error inesperado al conectar con la base de datos', error: error.message });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Obtener todos los tipos de bancos
  getBankTypes = async (req, res) => {
    let pool;
    try {
      logger.info('Intentando obtener todos los tipos de bancos.');
      pool = await sql.connect(configBD);

      const request = pool.request();
      const query = 'SELECT * FROM BankTypes';

      const result = await request.query(query);
      res.status(200).json({ rescode: 200, mensaje: 'Consulta de tipos de bancos realizada con éxito', result: result.recordset });
    } catch (err) {
      logger.error('Error al ejecutar consulta de tipos de bancos:', err);
      res.status(500).json({ rescode: 500, mensaje: 'Error al ejecutar consulta de tipos de bancos', code: err.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Obtener un tipo de banco por ID
  getBankTypeById = async (req, res) => {
    const { id } = req.query;

    if (!id) {
      logger.warn('Datos enviados incorrectamente. Falta el ID del tipo de banco.');
      res.status(400).send("Datos enviados incorrectamente");
      return;
    }

    let pool;
    try {
      logger.info(`Intentando obtener el tipo de banco con ID: ${id}`);
      pool = await sql.connect(configBD);

      const request = pool.request();
      request.input('bankTypeId', sql.Int, id);
      const query = 'SELECT * FROM BankTypes WHERE Id = @bankTypeId';

      const result = await request.query(query);

      if (!result.recordset[0]) {
        logger.info('Tipo de banco no encontrado.');
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de tipo de banco realizada, pero no se encontraron datos.' });
      } else {
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de tipo de banco realizada con éxito', result: result.recordset[0] });
      }
    } catch (error) {
      logger.error('Error al obtener el tipo de banco:', error);
      res.status(500).json({ mensaje: 'Error al consultar tipo de banco por ID', code: error.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Actualizar un tipo de banco
  updateBankType = async (req, res) => {
    const { id, currencyTypeId, bankName } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para actualizar un tipo de banco.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para actualizar el tipo de banco.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);
        request.input('currencyTypeId', sql.Int, currencyTypeId);
        request.input('bankName', sql.NVarChar, bankName);

        let query = `
          UPDATE BankTypes SET
          CurrencyTypeId = @currencyTypeId,
          BankName = @bankName
          WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Actualización exitosa del tipo de banco con ID: ${id}`);
        res.status(200).json({ mensaje: 'Actualización exitosa', result: { id } });
      } catch (innerError) {
        await transaction.rollback();
        logger.error('Error al ejecutar la transacción:', innerError);
        res.status(500).json({ mensaje: 'Error inesperado al procesar la solicitud', error: innerError.message });
      }
    } catch (error) {
      logger.error('Error al conectar con la base de datos:', error);
      res.status(500).json({ mensaje: 'Error inesperado al conectar con la base de datos', error: error.message });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Eliminar un tipo de banco
  deleteBankType = async (req, res) => {
    const { id } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para eliminar un tipo de banco.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para eliminar el tipo de banco.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);

        const query = `DELETE FROM BankTypes WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Eliminación exitosa del tipo de banco con ID: ${id}`);
        res.status(200).json({ mensaje: 'Eliminación exitosa', result: { id } });
      } catch (innerError) {
        await transaction.rollback();
        logger.error('Error al ejecutar la transacción:', innerError);
        res.status(500).json({ mensaje: 'Error inesperado al procesar la solicitud', error: innerError.message });
      }
    } catch (error) {
      logger.error('Error al conectar con la base de datos:', error);
      res.status(500).json({ mensaje: 'Error inesperado al conectar con la base de datos', error: error.message });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };
}

export default new BankTypesController();
