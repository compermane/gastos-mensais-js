import express, { Express } from "express"
import { PrismaClient } from '@prisma/client'
import { SERVER_PORT } from "./secrets"
import rootRouter from "./routes"
import path from "path"
import cors from "cors"

export const app: Express = express()
export const prismaClient = new PrismaClient({
    log: ['query']
})

const buildPath = path.join(__dirname, '../../client/build')
const indexPath = path.join(buildPath, 'index.html');

app.use(express.json());
app.use(cors())
// Rotas
app.use('/api', rootRouter)
app.use(express.static(buildPath))
app.get('*', (req, res) => {
    console.log(`Requisição para: ${req.url}`)
    console.log(`Servindo o arquivo: ${indexPath}`);
    res.sendFile(indexPath);
});

app.listen(SERVER_PORT, () => {
    console.log(`HTTP server running on port ${SERVER_PORT}`)
})
