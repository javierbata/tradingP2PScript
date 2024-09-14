import express from 'express';
import cryptoTypesController from "../controller/cryptoTypesController.js";
import logger from '../logger.js';

const router = express.Router();

// CryptoTypes Routes
router.get("/", (req, res) => {
  logger.info("Accessed Get /crypto-types route");
  cryptoTypesController.getCryptoTypes(req, res);
});

router.post("/", (req, res) => {
  logger.info("Accessed POST /crypto-types route");
  cryptoTypesController.postCryptoType(req, res);
});

router.put("/:id", (req, res) => {
  logger.info(`Accessed PUT /crypto-types/${req.params.id} route`);
  cryptoTypesController.updateCryptoType(req, res);
});

router.delete("/:id", (req, res) => {
  logger.info(`Accessed DELETE /crypto-types/${req.params.id} route`);
  cryptoTypesController.deleteCryptoType(req, res);
});

export default router;