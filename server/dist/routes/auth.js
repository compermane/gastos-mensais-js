"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authRoutes = (0, express_1.Router)();
// signUp - cadastro
// signIn - login
authRoutes.post('/signup', userController_1.signUp);
authRoutes.post('/signin', userController_1.signIn);
exports.default = authRoutes;
