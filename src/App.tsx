import { Component, createRef, RefObject } from "react"
import { Button, Separator } from "@/components/ui"
import { CreateTaskForm, Filters, TaskList } from "@/components"
import { generateTasks, isSubstring, storage } from "@/helpers"
import { Severity, type Task } from "@/types"
import styles from "./App.module.css"

type TaskListState = {
  tasks: Task[]
  filteredTasks: Task[]
  filterValues: FilterValues
}

export type Severities = {
  [key in Severity]?: boolean
}
export type FilterValues = {
  hideCompletedTasks: boolean
  severities: Severities
  searchValue?: string
}

export type FilterFunctions = {
  hideCompletedTasks: (tasks: Task[]) => Task[]
  filterTasksByTitle: (tasks: Task[]) => Task[]
  filterTasksBySeverity: (tasks: Task[]) => Task[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class App extends Component<{}, TaskListState> {
  private titleInput: RefObject<HTMLInputElement>
  private filters: FilterFunctions = {
    filterTasksByTitle: (tasks) => {
      const { searchValue } = this.state.filterValues
      if (!searchValue) {
        return tasks
      }

      return tasks.filter((task) => {
        const { title, description } = task

        return (
          isSubstring(title, searchValue) ||
          isSubstring(description, searchValue)
        )
      })
    },
    filterTasksBySeverity: (tasks) =>
      Object.values(this.state.filterValues.severities).some((s) => s !== false)
        ? tasks.filter(
            (task) => this.state.filterValues.severities[task.severity]
          )
        : tasks,
    hideCompletedTasks: (tasks) =>
      tasks.filter((task) =>
        this.state.filterValues.hideCompletedTasks ? !task.isDone : true
      ),
  }
  // @ts-expect-error props is always {}
  constructor(props) {
    super(props)
    this.titleInput = createRef()
    this.state = {
      tasks: [],
      filteredTasks: [],
      filterValues: {
        hideCompletedTasks: false,
        searchValue: "",
        severities: {
          low: false,
          mid: false,
          high: false,
        },
      },
    }
  }

  handleCreate = (task: Task) => {
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

  filterTasks = () => {
    this.setState({
      filteredTasks: Object.values(this.filters)
        .reduce(
          (tasks, filterFunction) => filterFunction(tasks),
          this.state.tasks
        )
        .sort((t1, t2) => t2.createdAtTimestamp - t1.createdAtTimestamp),
    })
  }

  handleFiltersChange = (filters: FilterValues) => {
    this.setState({
      filterValues: filters,
    })
  }

  handleGenerateTasks = () => {
    this.setState((state) => ({
      tasks: [...state.tasks, ...generateTasks()],
    }))
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

  componentDidUpdate(
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    prevProps: Readonly<{}>,
    prevState: Readonly<TaskListState>
  ): void {
    const haveFiltersChanged =
      prevState.filterValues !== this.state.filterValues

    const haveTasksChanged = prevState.tasks !== this.state.tasks

    if (haveFiltersChanged || haveTasksChanged) {
      this.filterTasks()
    }

    storage.setTasks(this.state.tasks)
  }

  render() {
    const {
      titleInput,
      handleCreate,
      handleDelete,
      handleToggleStatus,
      handleGenerateTasks,
      handleFiltersChange,
    } = this
    const { filterValues, filteredTasks, tasks } = this.state
    const { hideCompletedTasks, searchValue, severities } = filterValues

    return (
      <div className="flex flex-col p-6 gap-8 w-container max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-center">Todo List</h1>

        <CreateTaskForm onSubmit={handleCreate} inputRef={titleInput} />
        <Separator />
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleGenerateTasks}>
            Generate tasks
          </Button>
        </div>

        <div className={styles.wrapper}>
          <Filters
            searchClassName={styles.search}
            filtersClassName={styles.filters}
            filterValues={{ hideCompletedTasks, searchValue, severities }}
            onFiltersChange={handleFiltersChange}
          />
          <div className={styles.tasks}>
            {!filteredTasks.length && (
              <p className="text-center text-secondary">
                {tasks.length
                  ? `You don't have any tasks with these filters`
                  : `You don't have any tasks at the moment`}
              </p>
            )}
            <TaskList
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
