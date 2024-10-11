import { SEVERITIES, Severity, Task } from "@/types"
import { getUniqueTodoId } from "./getUniqueTodoId"

export const generateTodos = (n: number = 1000): Task[] => {
  return Array.from({ length: n }, () => generateTodo())
}

const generateTodo = (): Task => {
  return {
    id: getUniqueTodoId(),
    title: getRandomString(),
    description: Math.random() > 0.5 ? getRandomString() : "",
    createdAtTimestamp: Math.floor(Date.now() / 1000),
    isDone: Math.random() > 0.5,
    severity: getRandomSeverity(),
  }
}

const SEVERITIES_KEYS = Object.keys(SEVERITIES)
const SEVERITIES_KEYS_LENGTH = SEVERITIES_KEYS.length

const getRandomSeverity = (): Severity => {
  const randomIndex = Math.floor(Math.random() * SEVERITIES_KEYS_LENGTH)

  return SEVERITIES_KEYS[randomIndex] as Severity
}

const getRandomString = () => {
  return Math.random().toString(36).substring(2)
}
