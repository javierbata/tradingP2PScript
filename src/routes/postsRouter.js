import express from 'express';
import postsController from "../controller/postsController.js";
import logger from '../logger.js';

const router = express.Router();

// Posts Routes
router.get("/", (req, res) => {
  logger.info("Accessed /posts route");
  postsController.getPosts(req, res)
});

router.post("/", (req, res) => {
  logger.info("Accessed POST /posts route");
  postsController.getPostById(req, res)
});

router.put("/:id", (req, res) => {
  logger.info(`Accessed PUT /posts/${req.params.id} route`);
  postsController.updatePost(req, res)
});

router.delete("/:id", (req, res) => {
  logger.info(`Accessed DELETE /posts/${req.params.id} route`);
  postsController.deletePost(req, res)
});

export default router;