import express from 'express'
import {deleteUser, getAllUsers, getUser, loginUser, registerUser, updateUser} from "../resources/user.controller.js";
import {authenticatedToken} from "../middlewares/verifyToken.js";

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/').get(authenticatedToken, getUser)
router.route('/all').get(getAllUsers)
router.route('/:id').put(authenticatedToken, updateUser)
router.route('/:id').delete(authenticatedToken, deleteUser)
export default router