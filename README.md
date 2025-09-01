# Tasks API

Uma API REST simples para gerenciamento de tarefas (tasks) usando Node.js.  
Este projeto faz parte do estudo do curso de Node.js da **Rocketseat**.  
Permite criar, listar, atualizar, excluir e marcar tarefas como concluídas, além de importar tarefas via CSV.

---

## Funcionalidades

- CRUD completo de tarefas
  - **GET /tasks**: lista todas as tarefas com total de registros.
  - **POST /tasks**: cria uma nova tarefa.
  - **PUT /tasks/:id**: atualiza título e/ou descrição da tarefa.
  - **DELETE /tasks/:id**: remove uma tarefa pelo ID.
  - **PATCH /tasks/:id/complete**: alterna o status de conclusão da tarefa.
- Importação de tarefas via arquivo CSV
  - Envia um CSV com colunas `title` e `description`.
- Middlewares para tratamento de JSON e CSV.
- Validação de Content-Type para requisições com body.
- Armazenamento persistente em arquivo JSON (`db.json`).

---

## Instalação

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_PROJETO>
```

2. Instale as dependências (se houver algum pacote):

```bash
npm install
```

3. Execute a API:

```bash
node server.js
```

A API estará disponível em `http://localhost:3000`.

---

## Rotas

| Método | Endpoint                  | Descrição                                      |
|--------|---------------------------|-----------------------------------------------|
| GET    | /tasks                    | Lista todas as tarefas                        |
| POST   | /tasks                    | Cria uma nova tarefa                           |
| PUT    | /tasks/:id                | Atualiza título e/ou descrição da tarefa      |
| DELETE | /tasks/:id                | Remove uma tarefa                              |
| PATCH  | /tasks/:id/complete       | Marca ou desmarca a tarefa como concluída     |
| POST   | /tasks (CSV)              | Importa tarefas a partir de arquivo CSV       |

**Observação:** Para importar CSV, o `Content-Type` da requisição deve ser `text/csv`.

---

## Exemplo de requisição CSV

```bash
curl -X POST http://localhost:3000/tasks \
-H "Content-Type: text/csv" \
--data-binary @tasks.csv
```

> O CSV deve conter duas colunas: `title` e `description`. A primeira linha é ignorada como header.

---

## Estrutura de uma Task

```json
{
  "id": "uuid",
  "title": "Nome da tarefa",
  "description": "Descrição detalhada",
  "completedAt": null,
  "createdAt": 1693526400,
  "updatedAt": 1693526400
}
```

- `completedAt`: timestamp quando a tarefa foi concluída, `null` se ainda não concluída.
- `createdAt` / `updatedAt`: timestamps em segundos desde 1970.

---

## Observações

- Desenvolvido utilizando Node.js puro, módulos internos e `csv-parse`.
- Suporta middlewares personalizados para JSON e CSV.
- Persistência é feita em arquivo JSON (`db.json`).
- Projeto inspirado no curso de Node.js da **Rocketseat**.

---

## Autor

Seu Nome - [GitHub](https://github.com/seu-usuario)

