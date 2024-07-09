import {Router} from "express";
import authRoutes from "./auth";
import { expenseRoutes } from "./gasto";

const rootRouter: Router = Router()

rootRouter.use('/auth', authRoutes)
rootRouter.use('/gasto', expenseRoutes)

export default rootRouter;