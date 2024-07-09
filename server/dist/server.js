"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const secrets_1 = require("./secrets");
const routes_1 = __importDefault(require("./routes"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
exports.app = (0, express_1.default)();
exports.prismaClient = new client_1.PrismaClient({
    log: ['query']
});
const buildPath = path_1.default.join(__dirname, '../../client/build');
const indexPath = path_1.default.join(buildPath, 'index.html');
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
// Rotas
exports.app.use('/api', routes_1.default);
exports.app.use(express_1.default.static(buildPath));
exports.app.get('*', (req, res) => {
    console.log(`Requisição para: ${req.url}`);
    console.log(`Servindo o arquivo: ${indexPath}`);
    res.sendFile(indexPath);
});
exports.app.listen(secrets_1.SERVER_PORT, () => {
    console.log(`HTTP server running on port ${secrets_1.SERVER_PORT}`);
});
