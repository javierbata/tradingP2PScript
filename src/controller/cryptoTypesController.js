// controllers/CryptoTypesController.js
import sql from 'mssql';
import config from "../config.js";
import logger from '../logger.js';

const configBD = config.BD;

class CryptoTypesController {

  // Crear un nuevo tipo de criptomoneda
  postCryptoType = async (req, res) => {
    const { cryptoName } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para registrar un tipo de criptomoneda.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para registrar el tipo de criptomoneda.');

        const request = new sql.Request(transaction);
        request.input('cryptoName', sql.NVarChar, cryptoName);

        let query = `
          INSERT INTO CryptoTypes (CryptoName) 
          OUTPUT INSERTED.Id 
          VALUES (@cryptoName)`;

        const result = await request.query(query);
        const cryptoTypeId = result.recordset[0].Id;

        await transaction.commit();
        logger.info(`Registro exitoso del tipo de criptomoneda con ID: ${cryptoTypeId}`);
        res.status(200).json({ mensaje: 'Registro exitoso', result: { cryptoTypeId } });
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

  // Obtener todos los tipos de criptomonedas
  getCryptoTypes = async (req, res) => {
    let pool;
    try {
      logger.info('Intentando obtener todos los tipos de criptomonedas.');
      pool = await sql.connect(configBD);

      const request = pool.request();
      const query = 'SELECT * FROM CryptoTypes';

      const result = await request.query(query);
      res.status(200).json({ rescode: 200, mensaje: 'Consulta de tipos de criptomonedas realizada con éxito', result: result.recordset });
    } catch (err) {
      logger.error('Error al ejecutar consulta de tipos de criptomonedas:', err);
      res.status(500).json({ rescode: 500, mensaje: 'Error al ejecutar consulta de tipos de criptomonedas', code: err.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Obtener un tipo de criptomoneda por ID
  getCryptoTypeById = async (req, res) => {
    const { id } = req.query;

    if (!id) {
      logger.warn('Datos enviados incorrectamente. Falta el ID del tipo de criptomoneda.');
      res.status(400).send("Datos enviados incorrectamente");
      return;
    }

    let pool;
    try {
      logger.info(`Intentando obtener el tipo de criptomoneda con ID: ${id}`);
      pool = await sql.connect(configBD);

      const request = pool.request();
      request.input('cryptoTypeId', sql.Int, id);
      const query = 'SELECT * FROM CryptoTypes WHERE Id = @cryptoTypeId';

      const result = await request.query(query);

      if (!result.recordset[0]) {
        logger.info('Tipo de criptomoneda no encontrado.');
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de tipo de criptomoneda realizada, pero no se encontraron datos.' });
      } else {
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de tipo de criptomoneda realizada con éxito', result: result.recordset[0] });
      }
    } catch (error) {
      logger.error('Error al obtener el tipo de criptomoneda:', error);
      res.status(500).json({ mensaje: 'Error al consultar tipo de criptomoneda por ID', code: error.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Actualizar un tipo de criptomoneda
  updateCryptoType = async (req, res) => {
    const { id, cryptoName } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para actualizar un tipo de criptomoneda.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para actualizar el tipo de criptomoneda.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);
        request.input('cryptoName', sql.NVarChar, cryptoName);

        let query = `
          UPDATE CryptoTypes SET
          CryptoName = @cryptoName
          WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Actualización exitosa del tipo de criptomoneda con ID: ${id}`);
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

  // Eliminar un tipo de criptomoneda
  deleteCryptoType = async (req, res) => {
    const { id } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para eliminar un tipo de criptomoneda.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para eliminar el tipo de criptomoneda.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);

        const query = `DELETE FROM CryptoTypes WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Eliminación exitosa del tipo de criptomoneda con ID: ${id}`);
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

export default new CryptoTypesController();
