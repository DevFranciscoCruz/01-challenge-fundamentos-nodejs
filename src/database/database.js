import { readFile, writeFile } from 'node:fs/promises'

export class Database {
  #database = { 'tasks': [] }
  #databasePath = new URL('db.json', import.meta.url)

  constructor() {
    readFile(this.#databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persistData()
      })
  }

  #persistData() {
    writeFile(this.#databasePath, JSON.stringify(this.#database))
  }

  getData() {
    return this.#database['tasks'] ?? []
  }

  getDataByID(id) {
    const rowIndex = this.#database['tasks'].findIndex(row => row.id === id)
    if (rowIndex === -1) return null

    return this.#database['tasks'][rowIndex]
  }

  insertData(data) {
    this.#database['tasks'].push(data)

    this.#persistData()
  }

  updateData(id, data) {
    if (!Object.keys(data).length) return null

    const rowIndex = this.#database['tasks'].findIndex(row => row.id === id)
    const updatedTask = {
      ...this.#database['tasks'][rowIndex],
      ...data,
      updatedAt: Math.floor(Date.now() / 1000)
    }

    this.#database['tasks'][rowIndex] = updatedTask
    this.#persistData()

    return updatedTask
  }

  deleteData(id) {
    const rowIndex = this.#database['tasks'].findIndex(row => row.id === id)
    if (rowIndex === -1) return null

    this.#database['tasks'].splice(rowIndex, 1)
    this.#persistData()

    return true
  }
}