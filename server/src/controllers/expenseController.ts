import { Request, Response } from 'express'
import { prismaClient } from '../server'
import { BadRequestsException, IncorrectPasswordError, NoJWTSecretSpecifiedError, UserNotFoundError } from '../utils/exceptions'

export const createExpense = async (req: Request, res: Response) => {
    const { descricao, valor } = req.body
    const userId = req.user.id

    try {
        if(isNaN(parseFloat(valor)) || !isFinite(parseFloat(valor))) {
            throw new BadRequestsException("Valor de gasto inválido")
        }
        const newExpense = await prismaClient.gasto.create({
            data: { descricao, valor: parseFloat(valor), userId: userId }
        })

        console.log(newExpense)

        res.status(200).json(newExpense)
    }
    catch(error: any) {
        console.error("Erro registrando novo gasto: ", error)
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
    }
}

export const getMonthlyTotal = async (req: Request, res: Response) => {
    const { mes, ano } = req.params
    const userId = req.user.id

    console.log(`mes: ${mes} ano: ${ano}`)
    const monthInt = parseInt(mes)
    const yearInt = parseInt(ano)

    if(isNaN(monthInt) || isNaN(yearInt)) {
        return res.status(400).json({ message: "Mês ou ano inválido" })
    }

    try {
        const firstDay = new Date(yearInt, monthInt - 1, 1)
        const lastDay = new Date(yearInt, monthInt, 0)

        const total = await prismaClient.gasto.aggregate({
            _sum: { valor: true },
            where: { userId, data: { gte: firstDay, lte: lastDay }}
        })

        !total._sum.valor ? res.status(200).json({ total: 0 }): res.status(200).json({ total: total._sum.valor })
    }
    catch(error: any){
        res.status(500).json({ message: error.message, statusCode: 500 })
    }
}

export const getExpenses = async (req: Request, res: Response) => {
    const userId = req.user.id
    try {
        let user = await prismaClient.user.findFirst({ where: {id: userId} })

        if(!user) {
            throw new BadRequestsException("Usuário não identificado")
        }

        const gastos = await prismaClient.gasto.findMany({ where: { userId } })
        res.status(200).json(gastos)
    }
    catch(error: any) {
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
    }
}

export const deleteExpense = async (req: Request, res: Response) => {
    const userId = req.user.id
    const expenseId = parseInt(req.params.id)

    try {
        let user = await prismaClient.user.findFirst({ where: {id: userId} })

        if(!user) {
            throw new BadRequestsException("Usuário não identificado")
        }

        const gasto = await prismaClient.gasto.findFirst({ where: {id: expenseId, userId: req.user.id} })

        if(!gasto) {
            throw new BadRequestsException("Gasto não identificado")
        }

        const response = await prismaClient.gasto.delete({ where: {id: expenseId, userId: req.user.id} })
        res.status(200).json(response)
    }
    catch(error: any) {
        console.error(error)
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
    }
}