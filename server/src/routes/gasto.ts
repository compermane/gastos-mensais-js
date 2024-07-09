import { Router } from 'express';
import { createExpense, deleteExpense, getExpenses, getMonthlyTotal } from '../controllers/expenseController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/create-expense', authMiddleware, createExpense);
router.get('/total/:ano/:mes', authMiddleware, getMonthlyTotal);
router.get('/todos', authMiddleware, getExpenses);
router.delete('/delete-expense/:id', authMiddleware, deleteExpense)

export { router as expenseRoutes };