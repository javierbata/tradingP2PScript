import sql from 'mssql';
import config from "../config.js";
import logger from '../logger.js';

const configBD = config.BD;

class postsController {
  
  // Crear un nuevo post
  postPost = async (req, res) => {
    const { userId, postedPrice, availableAmount, minAmount, maxAmount, bankTypeId, cryptoTypeId, orderTypeId, orderCount, completionRate, likeCount } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para registrar un post.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para registrar el post.');

        const request = new sql.Request(transaction);
        request.input('userId', sql.Int, userId);
        request.input('postedPrice', sql.Decimal(10, 2), postedPrice);
        request.input('availableAmount', sql.Decimal(10, 2), availableAmount);
        request.input('minAmount', sql.Decimal(10, 2), minAmount);
        request.input('maxAmount', sql.Decimal(10, 2), maxAmount);
        request.input('bankTypeId', sql.Int, bankTypeId);
        request.input('cryptoTypeId', sql.Int, cryptoTypeId);
        request.input('orderTypeId', sql.Int, orderTypeId);
        request.input('orderCount', sql.Int, orderCount);
        request.input('completionRate', sql.Decimal(10, 5), completionRate);
        request.input('likeCount', sql.Decimal(10, 5), likeCount);

        let query = `
          INSERT INTO Posts (
            UserId, PostedPrice, AvailableAmount, MinAmount, MaxAmount, 
            BankTypeId, CryptoTypeId, OrderTypeId, PostDate, OrderCount, CompletionRate, LikeCount
          ) 
          OUTPUT INSERTED.Id 
          VALUES (
            @userId, @postedPrice, @availableAmount, @minAmount, @maxAmount, 
            @bankTypeId, @cryptoTypeId, @orderTypeId, SYSDATETIMEOFFSET(), @orderCount, @completionRate, @likeCount
          )`;

        const result = await request.query(query);
        const postId = result.recordset[0].Id;

        await transaction.commit();
        logger.info(`Registro exitoso del post con ID: ${postId}`);
        res.status(200).json({ mensaje: 'Registro exitoso', result: { postId } });
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

  // Obtener todos los posts
  getPosts = async (req, res) => {
    let pool;
    try {
      logger.info('Intentando obtener todos los posts.');
      pool = await sql.connect(configBD);

      const request = pool.request();
      const query = 'SELECT * FROM Posts';

      const result = await request.query(query);
      res.status(200).json({ rescode: 200, mensaje: 'Consulta de posts realizada con éxito', result: result.recordset });
    } catch (err) {
      logger.error('Error al ejecutar consulta de posts:', err);
      res.status(500).json({ rescode: 500, mensaje: 'Error al ejecutar consulta de posts', code: err.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Obtener un post por ID
  getPostById = async (req, res) => {
    const { id } = req.query;

    if (!id) {
      logger.warn('Datos enviados incorrectamente. Falta el ID del post.');
      res.status(400).send("Datos enviados incorrectamente");
      return;
    }

    let pool;
    try {
      logger.info(`Intentando obtener el post con ID: ${id}`);
      pool = await sql.connect(configBD);

      const request = pool.request();
      request.input('postId', sql.Int, id);
      const query = 'SELECT * FROM Posts WHERE Id = @postId';

      const result = await request.query(query);

      if (!result.recordset[0]) {
        logger.info('Post no encontrado.');
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de post realizada, pero no se encontraron datos.' });
      } else {
        res.status(200).json({ rescode: 200, mensaje: 'Consulta de post realizada con éxito', result: result.recordset[0] });
      }
    } catch (error) {
      logger.error('Error al obtener el post:', error);
      res.status(500).json({ mensaje: 'Error al consultar post por ID', code: error.code });
    } finally {
      if (pool) {
        await pool.close();
      }
    }
  };

  // Actualizar un post
  updatePost = async (req, res) => {
    const { id, userId, postedPrice, availableAmount, minAmount, maxAmount, bankTypeId, cryptoTypeId, orderTypeId, orderCount, completionRate, likeCount } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para actualizar un post.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para actualizar el post.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);
        request.input('userId', sql.Int, userId);
        request.input('postedPrice', sql.Decimal(10, 2), postedPrice);
        request.input('availableAmount', sql.Decimal(10, 2), availableAmount);
        request.input('minAmount', sql.Decimal(10, 2), minAmount);
        request.input('maxAmount', sql.Decimal(10, 2), maxAmount);
        request.input('bankTypeId', sql.Int, bankTypeId);
        request.input('cryptoTypeId', sql.Int, cryptoTypeId);
        request.input('orderTypeId', sql.Int, orderTypeId);
        request.input('orderCount', sql.Int, orderCount);
        request.input('completionRate', sql.Decimal(10, 5), completionRate);
        request.input('likeCount', sql.Decimal(10, 5), likeCount);

        let query = `
          UPDATE Posts SET
          UserId = @userId,
          PostedPrice = @postedPrice,
          AvailableAmount = @availableAmount,
          MinAmount = @minAmount,
          MaxAmount = @maxAmount,
          BankTypeId = @bankTypeId,
          CryptoTypeId = @cryptoTypeId,
          OrderTypeId = @orderTypeId,
          OrderCount = @orderCount,
          CompletionRate = @completionRate,
          LikeCount = @likeCount
          WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Actualización exitosa del post con ID: ${id}`);
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

  // Eliminar un post
  deletePost = async (req, res) => {
    const { id } = req.body;
    let pool;

    try {
      logger.info('Intentando conectar a la base de datos para eliminar un post.');
      pool = await sql.connect(configBD);

      const transaction = new sql.Transaction(pool);
      await transaction.begin();

      try {
        logger.info('Iniciando transacción para eliminar el post.');

        const request = new sql.Request(transaction);
        request.input('id', sql.Int, id);

        const query = `DELETE FROM Posts WHERE Id = @id`;

        await request.query(query);
        await transaction.commit();
        logger.info(`Eliminación exitosa del post con ID: ${id}`);
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

export default new postsController();
