import { createServer } from 'http'
import express from 'express'
import measureRoutes from './infra/http/routes/measureRoutes'

const app = express()

app.use(express.json())

app.use('/', measureRoutes)

// app.use((err: Error, req: express.Request, res: express.Response) => {
//    res.status(500).json({ error: err.message })
// })

const server = createServer(app)

const port = process.env.PORT || 80

server.listen(port, () => {
   console.log(`🪁 *Server running on port ${port}, http://localhost:${port}`)
})
