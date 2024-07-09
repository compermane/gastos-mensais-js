"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExpense = exports.getExpenses = exports.getMonthlyTotal = exports.createExpense = void 0;
const server_1 = require("../server");
const exceptions_1 = require("../utils/exceptions");
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { descricao, valor } = req.body;
    const userId = req.user.id;
    try {
        if (isNaN(parseFloat(valor)) || !isFinite(parseFloat(valor))) {
            throw new exceptions_1.BadRequestsException("Valor de gasto inválido");
        }
        const newExpense = yield server_1.prismaClient.gasto.create({
            data: { descricao, valor: parseFloat(valor), userId: userId }
        });
        console.log(newExpense);
        res.status(200).json(newExpense);
    }
    catch (error) {
        console.error("Erro registrando novo gasto: ", error);
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
    }
});
exports.createExpense = createExpense;
const getMonthlyTotal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mes, ano } = req.params;
    const userId = req.user.id;
    console.log(`mes: ${mes} ano: ${ano}`);
    const monthInt = parseInt(mes);
    const yearInt = parseInt(ano);
    if (isNaN(monthInt) || isNaN(yearInt)) {
        return res.status(400).json({ message: "Mês ou ano inválido" });
    }
    try {
        const firstDay = new Date(yearInt, monthInt - 1, 1);
        const lastDay = new Date(yearInt, monthInt, 0);
        const total = yield server_1.prismaClient.gasto.aggregate({
            _sum: { valor: true },
            where: { userId, data: { gte: firstDay, lte: lastDay } }
        });
        !total._sum.valor ? res.status(200).json({ total: 0 }) : res.status(200).json({ total: total._sum.valor });
    }
    catch (error) {
        res.status(500).json({ message: error.message, statusCode: 500 });
    }
});
exports.getMonthlyTotal = getMonthlyTotal;
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        let user = yield server_1.prismaClient.user.findFirst({ where: { id: userId } });
        if (!user) {
            throw new exceptions_1.BadRequestsException("Usuário não identificado");
        }
        const gastos = yield server_1.prismaClient.gasto.findMany({ where: { userId } });
        res.status(200).json(gastos);
    }
    catch (error) {
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
    }
});
exports.getExpenses = getExpenses;
const deleteExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const expenseId = parseInt(req.params.id);
    try {
        let user = yield server_1.prismaClient.user.findFirst({ where: { id: userId } });
        if (!user) {
            throw new exceptions_1.BadRequestsException("Usuário não identificado");
        }
        const gasto = yield server_1.prismaClient.gasto.findFirst({ where: { id: expenseId, userId: req.user.id } });
        if (!gasto) {
            throw new exceptions_1.BadRequestsException("Gasto não identificado");
        }
        const response = yield server_1.prismaClient.gasto.delete({ where: { id: expenseId, userId: req.user.id } });
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
    }
});
exports.deleteExpense = deleteExpense;
