import express from 'express';
//import x from "../controllers/p2pBinanceController.js";
import logger from '../logger.js';

const router = express.Router();

// Users Routes
router.get("/", (req, res) => {
  logger.info("Accessed /users route");
 // getAllUsers(req, res);
});

router.post("/", (req, res) => {
  logger.info("Accessed POST /users route");
 // createUser(req, res);
});

router.put("/:id", (req, res) => {
  logger.info(`Accessed PUT /users/${req.params.id} route`);
//  updateUser(req, res);
});

router.delete("/:id", (req, res) => {
  logger.info(`Accessed DELETE /users/${req.params.id} route`);
  //deleteUser(req, res);
});

export default router;