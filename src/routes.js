import { parse } from 'csv-parse'
import { randomUUID } from 'node:crypto'
import { Database } from "./database/database.js"
import { buildRoutePath } from './utils/buildRoutePath.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    requiredContentType: [],
    async handler(request, response) {
      const tasks = database.getData()
      const tasksData = {
        totalTasks: tasks.length,
        tasks: tasks
      }

      return response.setHeader('Content-Type', 'application/json').end(JSON.stringify(tasksData))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    requiredContentType: ['application/json', 'text/csv'],
    async handler(request, response) {
      if (request.headers['content-type'] === 'text/csv') {
        const parser = parse(request.body, {
          delimiter: ',',
          skipEmptyLines: true,
        });

        const expectedHeaders = ['Title', 'Description']
        const errors = []
        let lineNumber = 1;
        let headersChecked = false;

        for await (const record of parser) {
          if (!headersChecked) {
            const isValid = record.length === expectedHeaders.length && record.every((header, i) => header === expectedHeaders[i]);

            if (!isValid) return response.writeHead(422).end('Invalid CSV. Missing Required Headers')
            headersChecked = true
          }

          const [title, description] = record
          if (!title || title.trim() === '') {
            errors.push({ line: lineNumber, reason: 'Invalid Title' });
            continue;
          }

          database.insertData({ title, description })

          lineNumber++
        }

        if (errors.length) return response.writeHead(201).end(JSON.stringify(errors))

      } else {
        const { title, description } = request.body

        if (!title || !description) return response.writeHead(422).end()

        const task = {
          id: randomUUID(),
          title,
          description,
          completedAt: null,
          createdAt: Math.floor(Date.now() / 1000),
          updatedAt: Math.floor(Date.now() / 1000)
        }

        database.insertData(task)
      }

      return response.writeHead(201).end()
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    requiredContentType: ['application/json'],
    async handler(request, response) {
      const { id } = request.params

      if (!id || !request.body) return response.writeHead(422).end()

      const taskExists = database.getDataByID(id)
      if (!taskExists) return response.writeHead(404).end()

      const allowedFields = ['title', 'description']
      const taskUpdateData = {}

      for (const key of Object.keys(request.body)) {
        if (!allowedFields.includes(key)) continue

        const value = request.body[key]

        if (key === 'title' && (value === null || value === undefined || value === "")) continue

        taskUpdateData[key] = value
      }

      if (!Object.keys(taskUpdateData).length) return response.writeHead(422).end()

      const task = database.updateData(id, taskUpdateData)

      if (!task) return response.writeHead(422).end()

      return response.setHeader('Content-Type', 'application/json').end(JSON.stringify(task))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    requiredContentType: [],
    async handler(request, response) {
      const { id } = request.params

      if (!id) return response.writeHead(422).end()

      const taskExists = database.getDataByID(id)

      if (!taskExists) return response.writeHead(404).end()

      database.deleteData(id)

      return response.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    requiredContentType: [],
    async handler(request, response) {
      const { id } = request.params

      if (!id) return response.writeHead(422).end()

      const taskExists = database.getDataByID(id)

      if (!taskExists) return response.writeHead(404).end()

      const task = database.updateData(id, { completedAt: !!taskExists.completedAt ? null : Math.floor(Date.now() / 1000) })

      return response.setHeader('Content-Type', 'application/json').end(JSON.stringify(task))
    }
  },
]