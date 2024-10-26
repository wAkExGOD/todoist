import { SEVERITIES, Task } from "@/types"
import { getUniqueTaskId } from "./getUniqueTaskId"

export const generateTasks = (n: number = 1000): Task[] => {
  return Array.from({ length: n }, () => generateTask())
}

const generateTask = (): Task => {
  return {
    id: getUniqueTaskId(),
    title: getRandomString(),
    description: Math.random() > 0.5 ? getRandomString() : "",
    createdAtTimestamp: Math.floor(Date.now() / 1000),
    isDone: Math.random() > 0.5,
    severity: getRandomSeverity(),
  }
}

const getRandomSeverity = () => {
  return Object.values(SEVERITIES)[
    Math.floor(Math.random() * Object.values(SEVERITIES).length)
  ]
}

const getRandomString = () => {
  return Math.random().toString(36).substring(2)
}
