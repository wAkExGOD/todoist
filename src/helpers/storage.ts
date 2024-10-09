import { Task } from "@/types"

const LOCAL_STORAGE_TASKS_KEY = "tasks"

export const storage = {
  syncTasks: (tasks: Task[]): void => {
    if (!window.localStorage) {
      return
    }

    window.localStorage.setItem(LOCAL_STORAGE_TASKS_KEY, JSON.stringify(tasks))
  },
  getTasks: (): Task[] => {
    if (!window.localStorage) {
      return []
    }

    const tasks = window.localStorage.getItem(LOCAL_STORAGE_TASKS_KEY)

    const parsedTasks = typeof tasks === "string" ? JSON.parse(tasks) : []

    return parsedTasks
  },
}
