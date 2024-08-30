import { createServer } from 'http'
import express from 'express'
import measureRoutes from './infra/http/routes/measureRoutes'
import path from 'path'

const app = express()

//TODO: fiz na leitura da URL
app.use('/temp', express.static(path.join(__dirname, 'temp')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', measureRoutes)

const server = createServer(app)

const port = process.env.PORT || 80

server.listen(port, () => {
   console.log(`🪁 *Server running on dev port ${port}, prd http://localhost`)
})
