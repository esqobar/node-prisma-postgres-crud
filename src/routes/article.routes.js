import express from 'express'
import {createArticle, deleteArticle, getAllArticles, getArticle, updateArticle} from "../resources/article.controller.js";
import {authenticatedToken} from "../middlewares/verifyToken.js";

const router = express.Router()

router.route('/create').post(authenticatedToken, createArticle)
router.route('/').get(getAllArticles)
router.route('/:id').get(getArticle)
router.route('/:id').put(authenticatedToken, updateArticle)
router.route('/:id').delete(authenticatedToken, deleteArticle)
export default router