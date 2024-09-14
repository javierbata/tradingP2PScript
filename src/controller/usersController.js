// controllers/UsersController.js
import sql from 'mssql';
import config from "../config.js";
import logger from '../logger.js';

const configBD = config.BD;

class UsersController {
  
  // Crear un nuevo usuario
  postUser = async (req, res) => {
    const { userName, merchantType, codeName } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para registrar un usuario.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para registrar el usuario.');

        const request = new sql.Request(transaction);
        request.input('userName', sql.NVarChar, userName);
        request.input('merchantType', sql.Int, merchantType);
        request.input('codeName', sql.NVarChar, codeName);

        let query = `
          INSERT INTO Users (UserName, MerchantType, CodeName) 
          OUTPUT INSERTED.Id 
          VALUES (@userName, @merchantType, @codeName)`;

        const result = await request.query(query);
        const userId = result.recordset[0].Id;

        await transaction.commit();
        logger.info(`Registro exitoso del usuario con ID: ${userId}`);
        res.status(200).json({ mensaje: 'Registro exitoso', result: { userId } });
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

  // Obtener todos los usuarios
  getUsers = async (req, res) => {
    let pool;
    try {
      logger.info('Intentando obtener todos los usuarios.');
      pool = await sql.connect(configBD);

      const request = pool.request();
      const query = 'SELECT * FROM Users';

      const result = await request.query(query);
      res.status(200).json({ rescode: 200, mensaje: 'Consulta de usuarios realizada con éxito', result: result.recordset });
    } catch (err) {
      logger.error('Error al ejecutar consulta de usuarios:', err);
      res.status(500).json({ rescode: 500, mensaje: 'Error al ejecutar consulta de usuarios', code: err.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Obtener un usuario por ID
  getUserById = async (req, res) => {
    const { id } = req.query;

    if (!id) {
      logger.warn('Datos enviados incorrectamente. Falta el ID del usuario.');
      res.status(400).send("Datos enviados incorrectamente");
      return;
    }

    let pool;
    try {
      logger.info(`Intentando obtener el usuario con ID: ${id}`);
      pool = await sql.connect(configBD);

      const request = pool.request();
      request.input('userId', sql.Int, id);
      const query = 'SELECT * FROM Users WHERE Id = @userId';

      const result = await request.query(query);

      if (!result.recordset[0]) {
        logger.info('Usuario no encontrado.');
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de usuario realizada, pero no se encontraron datos.' });
      } else {
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de usuario realizada con éxito', result: result.recordset[0] });
      }
    } catch (error) {
      logger.error('Error al obtener el usuario:', error);
      res.status(500).json({ mensaje: 'Error al consultar usuario por ID', code: error.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Actualizar un usuario
  updateUser = async (req, res) => {
    const { id, userName, merchantType, codeName } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para actualizar un usuario.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para actualizar el usuario.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);
        request.input('userName', sql.NVarChar, userName);
        request.input('merchantType', sql.Int, merchantType);
        request.input('codeName', sql.NVarChar, codeName);

        let query = `
          UPDATE Users SET
          UserName = @userName,
          MerchantType = @merchantType,
          CodeName = @codeName
          WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Actualización exitosa del usuario con ID: ${id}`);
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

  // Eliminar un usuario
  deleteUser = async (req, res) => {
    const { id } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para eliminar un usuario.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para eliminar el usuario.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);

        const query = `DELETE FROM Users WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Eliminación exitosa del usuario con ID: ${id}`);
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

export default new UsersController();
