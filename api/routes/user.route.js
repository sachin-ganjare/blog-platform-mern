import express from 'express';
import { test, updateUser, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);

export default router;
