"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.signUp = void 0;
const server_1 = require("../server");
const exceptions_1 = require("../utils/exceptions");
const bcrypt_1 = require("bcrypt");
const secrets_1 = require("../secrets");
const jwt = __importStar(require("jsonwebtoken"));
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, senha } = req.body;
    try {
        if (!secrets_1.JWT_SECRET) {
            throw new exceptions_1.NoJWTSecretSpecifiedError("Chave JWT não especificada");
        }
        let user = yield server_1.prismaClient.user.findFirst({ where: { usuario } });
        if (user) {
            throw new exceptions_1.BadRequestsException("Usuário já cadastrado");
        }
        user = yield server_1.prismaClient.user.create({
            data: {
                usuario,
                senha: (0, bcrypt_1.hashSync)(senha, 10)
            }
        });
        res.status(201).json(user);
    }
    catch (error) {
        console.error("Erro registrando novo usuário: ", error);
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
    }
});
exports.signUp = signUp;
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario, senha } = req.body;
    try {
        if (!secrets_1.JWT_SECRET) {
            throw new exceptions_1.NoJWTSecretSpecifiedError("Chave JWT não especificada");
        }
        let user = yield server_1.prismaClient.user.findFirst({ where: { usuario } });
        if (!user) {
            throw new exceptions_1.UserNotFoundError("Usuário ou senha inválidos");
        }
        let verifyPass = yield (0, bcrypt_1.compareSync)(senha, user.senha);
        if (!verifyPass) {
            throw new exceptions_1.IncorrectPasswordError("Usuário ou senha inválidos");
        }
        const token = jwt.sign({ userId: user.id }, secrets_1.JWT_SECRET, {
            expiresIn: "2h"
        });
        const { senha: _ } = user, userLogin = __rest(user, ["senha"]);
        res.status(200).json({
            user: userLogin,
            token: token
        });
    }
    catch (error) {
        console.error("Erro em login: ", error.message);
        res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
    }
});
exports.signIn = signIn;
