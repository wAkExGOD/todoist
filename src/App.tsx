import { Component, createRef, RefObject } from "react"
import { Separator } from "@/components/ui"
import { CreateTodoForm, Filters, TodoList } from "@/components"
import { storage } from "@/helpers"
import { Severity, type Task } from "@/types"
import styles from "./App.module.css"

type TodoListState = {
  tasks: Task[]
  filteredTasks: Task[]
}

export type FilterValues = {
  hideCompletedTasks: boolean
  severity: Severity
  searchValue: string
}

export type FilterFunctions = {
  hideCompletedTasks: (
    tasks: Task[]
  ) => (hideCompletedTasks: FilterValues["hideCompletedTasks"]) => Task[]
  filterTasksByTitle: (
    tasks: Task[]
  ) => (searchValue: FilterValues["searchValue"]) => Task[]
  filterTasksBySeverity: (
    tasks: Task[]
  ) => (severity: FilterValues["severity"]) => Task[]
}

const FILTER_FUNCTION_PARAMS = {
  hideCompletedTasks: "hideCompletedTasks",
  filterTasksByTitle: "searchValue",
  filterTasksBySeverity: "severity",
} as const

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class App extends Component<{}, TodoListState> {
  private titleInput: RefObject<HTMLInputElement>
  private filters: FilterFunctions = {
    hideCompletedTasks: (tasks) => (hideCompletedTasks) =>
      tasks
        .sort((t1, t2) => t2.createdAtTimestamp - t1.createdAtTimestamp)
        .filter((task) => task.isDone === hideCompletedTasks),
    filterTasksByTitle: (tasks) => (searchValue) =>
      searchValue
        ? tasks.filter((task) =>
            task.title.toLocaleLowerCase().includes(searchValue)
          )
        : tasks,
    filterTasksBySeverity: (tasks) => (severity) =>
      tasks.filter((task) => task.severity === severity),
  }
  // @ts-expect-error props is always {}
  constructor(props) {
    super(props)
    this.titleInput = createRef()
    this.state = {
      tasks: [],
      filteredTasks: [],
    }
  }

  handleCreateTaskSubmit = (task: Task) => {
    this.setState((state) => ({
      tasks: [...state.tasks, task],
    }))

    this.titleInput.current?.focus()
  }

  handleDelete = (id: Task["id"]) => {
    this.setState((state) => ({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== id),
    }))
  }

  handleToggleStatus = (id: Task["id"], isDone: boolean) => {
    const newTasks = this.state.tasks.map((task) =>
      task.id === id ? { ...task, isDone } : task
    )
    const newFilteredTasks = this.state.filteredTasks.map((task) =>
      task.id === id ? { ...task, isDone } : task
    )
    this.setState({
      tasks: newTasks,
      filteredTasks: newFilteredTasks,
    })
  }

  handleFilterTasks = (values: FilterValues) => {
    const filteredTasks = Object.entries(this.filters).reduce((tasks, cur) => {
      const filterFunction = cur[1](tasks)

      const filterBy = values[FILTER_FUNCTION_PARAMS[cur[0]]]
      console.log(filterFunction, filterBy)

      return filterFunction(filterBy)
    }, this.state.tasks)
    console.log(this.state.tasks, filteredTasks)

    this.setState({
      filteredTasks,
    })
  }

  componentDidMount() {
    // Setting shadcn/ui theme:
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add("dark")

    const savedTasks = storage.getTasks()

    if (!savedTasks.length) {
      return
    }

    this.setState({
      tasks: savedTasks,
      filteredTasks: savedTasks,
    })

    this.titleInput.current?.focus()
  }

  componentDidUpdate() {
    storage.syncTasks(this.state.tasks)
  }

  render() {
    const {
      titleInput,
      handleCreateTaskSubmit,
      handleDelete,
      handleToggleStatus,
      handleFilterTasks,
    } = this
    const { tasks, filteredTasks } = this.state

    return (
      <div className="flex flex-col p-6 gap-8 w-container max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-center">Todo List</h1>

        <CreateTodoForm
          onSubmit={handleCreateTaskSubmit}
          inputRef={titleInput}
        />
        <Separator />

        <div className={styles.wrapper}>
          <Filters
            searchClassName={styles.search}
            filtersClassName={styles.filters}
            onFilter={handleFilterTasks}
            tasks={tasks}
          />
          <div className={styles.todos}>
            <TodoList
              tasks={filteredTasks}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    )
  }
}
