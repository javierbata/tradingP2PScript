import express from 'express';
import currencyTypesController from "../controller/currencyTypesController.js";
import logger from '../logger.js';

const router = express.Router();

// CurrencyTypes Routes
router.get("/", (req, res) => {
  logger.info("Accessed /currency-types route");
  currencyTypesController.getCurrencyTypes(req, res);
});

router.post("/", (req, res) => {
  logger.info("Accessed POST /currency-types route");
  currencyTypesController.postCurrencyType(req, res);
});

router.put("/:id", (req, res) => {
  logger.info(`Accessed PUT /currency-types/${req.params.id} route`);
  currencyTypesController.updateCurrencyType(req, res);
});

router.delete("/:id", (req, res) => {
  logger.info(`Accessed DELETE /currency-types/${req.params.id} route`);
  currencyTypesController.deleteCurrencyType(req, res);
});

export default router;