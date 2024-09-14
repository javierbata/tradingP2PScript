// src/controllers/DBControllerGET.js
import db from '../config/db.js';
import logger from '../logger.js';

class DBControllerGET {
  async mainController() {
    await this.fetchPostsByDateRange("2024-03-05 22:49:00", "2043-03-05 22:49:59");
  }

  async fetchPostsByDateRange(startDate, endDate) {
    const query = `SELECT * FROM Posts WHERE PostDate BETWEEN ? AND ?`;
    let connection = await db.getConnection();

    try {
      const results = await this.executeQuery(connection, query, [startDate, endDate]);
      if (results.length > 0) {
        logger.info(`Found ${results.length} posts between ${startDate} and ${endDate}.`);
        console.log('Posts:', results);
        return results;
      } else {
        logger.info('No posts found in the specified date range.');
        return [];
      }
    } catch (error) {
      logger.error('Error fetching posts by date range:', error.message);
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

export default DBControllerGET;
