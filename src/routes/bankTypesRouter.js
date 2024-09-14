import express from 'express';
import bankTypesController from "../controller/bankTypesController.js";
import logger from '../logger.js';

const router = express.Router();

// BankTypes Routes
router.get("/", (req, res) => {
  logger.info("Accessed /bank-types route");
  bankTypesController.getBankTypes(req, res)
});

router.post("/", (req, res) => {
  logger.info("Accessed POST /bank-types route");
  bankTypesController.postBankType(req, res);
});

router.put("/:id", (req, res) => {
  logger.info(`Accessed PUT /bank-types/${req.params.id} route`);
  bankTypesController.updateBankType(req, res);
});

router.delete("/:id", (req, res) => {
  logger.info(`Accessed DELETE /bank-types/${req.params.id} route`);
  bankTypesController.deleteBankType(req, res);
});

export default router;