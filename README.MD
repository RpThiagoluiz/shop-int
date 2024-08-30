# Back-end API para Gerenciamento de Medições

## Iniciar

Para iniciar a aplicação, use o seguinte comando:

```bash
docker-compose up --build
```
## Testar
Root do existe um arquivo chamado <b>api.rest</b> basta ter a extensão <b>rest client</b> do vsCode instalada e testar a aplicação.

## Tech

![Node.js](https://img.shields.io/badge/Node.js-20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Docker](https://img.shields.io/badge/Docker-20.10-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.19-yellow)
![Jest](https://img.shields.io/badge/Jest-29.7-red)
![ESLint](https://img.shields.io/badge/ESLint-9.9-brightgreen)
![Prettier](https://img.shields.io/badge/Prettier-3.3.3-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

Este projeto é uma API REST desenvolvida em Node.js com TypeScript. A API gerencia a leitura de consumo de água e gás e utiliza Docker para conteinerização. Além de realizar a leitura via base64 que é enviado para um LLM que revolve o valor da conta enviada.

### Rotas
`GET /<customer code>/list` <br/>
`PATCH /confirm` <br/>
`POST /upload` <br/>

### Node
Node version >= 20

