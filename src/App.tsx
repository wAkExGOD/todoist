import { Component, createRef, RefObject } from "react"
import { Separator } from "@/components/ui"
import { CreateTodoForm, Filters, TodoList } from "@/components"
import { storage } from "@/helpers"
import { type Task } from "@/types"
import styles from "./App.module.css"

type TodoListState = {
  tasks: Task[]
  filteredTasks: Task[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class App extends Component<{}, TodoListState> {
  private titleInput: RefObject<HTMLInputElement>
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
    this.setState((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, isDone } : task
      ),
    }))
  }

  handleFilterTasks = (tasks: Task[]) => {
    this.setState({
      filteredTasks: tasks,
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
