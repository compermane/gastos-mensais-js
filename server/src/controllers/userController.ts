import { Request, Response } from 'express'
import { prismaClient } from '../server'
import { BadRequestsException, IncorrectPasswordError, NoJWTSecretSpecifiedError, UserNotFoundError } from '../utils/exceptions'
import { hashSync, compareSync } from 'bcrypt';
import { JWT_SECRET } from '../secrets';
import * as jwt from "jsonwebtoken";

export const signUp = async (req: Request, res: Response) => {
    const { usuario, senha } = req.body

    try {
        if(!JWT_SECRET) {
            throw new NoJWTSecretSpecifiedError("Chave JWT não especificada")
        }

        let user = await prismaClient.user.findFirst({ where: {usuario} })

        if(user) {
            throw new BadRequestsException("Usuário já cadastrado")
        }

        user = await prismaClient.user.create( { 
            data: {
                usuario,
                senha: hashSync(senha, 10)
            }
         } )

         res.status(201).json(user)
    }
    catch(error: any) {
        console.error("Erro registrando novo usuário: ", error)
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
    }
}

export const signIn = async (req: Request, res: Response) => {
    const { usuario, senha } = req.body

    try {
        if(!JWT_SECRET) {
            throw new NoJWTSecretSpecifiedError("Chave JWT não especificada")
        }

        let user = await prismaClient.user.findFirst({ where: {usuario} })
        
        if(!user) {
            throw new UserNotFoundError("Usuário ou senha inválidos")
        }

        let verifyPass = await compareSync(senha, user.senha)

        if(!verifyPass) {
            throw new IncorrectPasswordError("Usuário ou senha inválidos")
        }

        const token = jwt.sign( { userId: user.id }, JWT_SECRET, {
            expiresIn: "2h"
        })
    
        const { senha:_, ...userLogin } = user
        res.status(200).json({ 
            user: userLogin,
            token: token
        })
    }
    catch(error: any) {
        console.error("Erro em login: ", error.message)
        res.status(error.statusCode).json( { message: error.message, statusCode: error.statusCode })
    }
}