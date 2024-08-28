import express, { Request, Response } from 'express';
import { createServer } from 'http';

const app = express();
app.use(express.json());
// app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
   res.send('Hello World!').status(200);
});

const server = createServer(app);

const port = process.env.PORT || 80;

server.listen(port, () => {
   console.log(`🪁 *Server running on port ${port}, http://localhost:${port}`);
});
