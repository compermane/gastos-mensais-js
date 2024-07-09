import {Router} from 'express'
import { signIn, signUp } from '../controllers/userController'

const authRoutes: Router = Router()

// signUp - cadastro
// signIn - login
authRoutes.post('/signup', signUp)
authRoutes.post('/signin', signIn)

export default authRoutes