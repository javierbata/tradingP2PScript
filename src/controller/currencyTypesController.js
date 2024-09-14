// controllers/CurrencyTypesController.js
import sql from 'mssql';
import config from "../config.js";
import logger from '../logger.js';

const configBD = config.BD;

class CurrencyTypesController {

  // Crear un nuevo tipo de moneda
  postCurrencyType = async (req, res) => {
    const { currencyName } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para registrar un tipo de moneda.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para registrar el tipo de moneda.');

        const request = new sql.Request(transaction);
        request.input('currencyName', sql.NVarChar, currencyName);

        let query = `
          INSERT INTO CurrencyTypes (CurrencyName) 
          OUTPUT INSERTED.Id 
          VALUES (@currencyName)`;

        const result = await request.query(query);
        const currencyTypeId = result.recordset[0].Id;

        await transaction.commit();
        logger.info(`Registro exitoso del tipo de moneda con ID: ${currencyTypeId}`);
        res.status(200).json({ mensaje: 'Registro exitoso', result: { currencyTypeId } });
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

  // Obtener todos los tipos de moneda
  getCurrencyTypes = async (req, res) => {
    let pool;
    try {
      logger.info('Intentando obtener todos los tipos de moneda.');
      pool = await sql.connect(configBD);

      const request = pool.request();
      const query = 'SELECT * FROM CurrencyTypes';

      const result = await request.query(query);
      res.status(200).json({ rescode: 200, mensaje: 'Consulta de tipos de moneda realizada con éxito', result: result.recordset });
    } catch (err) {
      logger.error('Error al ejecutar consulta de tipos de moneda:', err);
      res.status(500).json({ rescode: 500, mensaje: 'Error al ejecutar consulta de tipos de moneda', code: err.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Obtener un tipo de moneda por ID
  getCurrencyTypeById = async (req, res) => {
    const { id } = req.query;

    if (!id) {
      logger.warn('Datos enviados incorrectamente. Falta el ID del tipo de moneda.');
      res.status(400).send("Datos enviados incorrectamente");
      return;
    }

    let pool;
    try {
      logger.info(`Intentando obtener el tipo de moneda con ID: ${id}`);
      pool = await sql.connect(configBD);

      const request = pool.request();
      request.input('currencyTypeId', sql.Int, id);
      const query = 'SELECT * FROM CurrencyTypes WHERE Id = @currencyTypeId';

      const result = await request.query(query);

      if (!result.recordset[0]) {
        logger.info('Tipo de moneda no encontrado.');
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de tipo de moneda realizada, pero no se encontraron datos.' });
      } else {
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de tipo de moneda realizada con éxito', result: result.recordset[0] });
      }
    } catch (error) {
      logger.error('Error al obtener el tipo de moneda:', error);
      res.status(500).json({ mensaje: 'Error al consultar tipo de moneda por ID', code: error.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Actualizar un tipo de moneda
  updateCurrencyType = async (req, res) => {
    const { id, currencyName } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para actualizar un tipo de moneda.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para actualizar el tipo de moneda.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);
        request.input('currencyName', sql.NVarChar, currencyName);

        let query = `
          UPDATE CurrencyTypes SET
          CurrencyName = @currencyName
          WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Actualización exitosa del tipo de moneda con ID: ${id}`);
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

  // Eliminar un tipo de moneda
  deleteCurrencyType = async (req, res) => {
    const { id } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para eliminar un tipo de moneda.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para eliminar el tipo de moneda.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);

        const query = `DELETE FROM CurrencyTypes WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Eliminación exitosa del tipo de moneda con ID: ${id}`);
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

export default new CurrencyTypesController();
