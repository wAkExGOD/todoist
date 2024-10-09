import { Component, createRef, RefObject } from "react"
import { Label, Separator, Switch } from "@/components/ui"
import { CreateTodoForm, TodoItem } from "@/components"
import { storage } from "@/helpers"
import type { Task } from "@/types"

type TodoListState = {
  tasks: Task[]
  hideCompletedTasks: boolean
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
      hideCompletedTasks: false,
    }
  }

  handleCreateTaskSubmit = (task: Task) => {
    this.setState((state) => ({
      tasks: [...state.tasks, task],
    }))

    this.titleInput.current?.focus()
  }

  handleToggleStatus = (id: Task["id"], isDone: boolean) => {
    this.setState((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, isDone } : task
      ),
    }))
  }

  handleDelete = (id: Task["id"]) => {
    this.setState((state) => ({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== id),
    }))
  }

  handleToggleFilter = (isChecked: boolean) => {
    this.setState({
      hideCompletedTasks: isChecked,
    })
  }

  getFilteredTasks = () => {
    const { tasks, hideCompletedTasks } = this.state

    return hideCompletedTasks
      ? tasks
          .sort((t1, t2) => t2.createdAtTimestamp - t1.createdAtTimestamp)
          .filter((task) => task.isDone === false)
      : tasks
          .sort((t1, t2) => t2.createdAtTimestamp - t1.createdAtTimestamp)
          .sort((t1, t2) => Number(t1.isDone) - Number(t2.isDone))
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
      handleToggleStatus,
      handleDelete,
      handleToggleFilter,
      getFilteredTasks,
    } = this
    const { tasks, hideCompletedTasks } = this.state

    const filteredTasks = getFilteredTasks()

    return (
      <div className="flex flex-col p-6 gap-8 w-container max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-center">Todo List</h1>

        <CreateTodoForm
          onSubmit={handleCreateTaskSubmit}
          inputRef={titleInput}
        />
        <Separator />

        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="only-uncompleted-tasks"
              checked={hideCompletedTasks}
              onCheckedChange={handleToggleFilter}
            />
            <Label htmlFor="only-uncompleted-tasks" className="cursor-pointer">
              Hide completed tasks
            </Label>
          </div>

          <div className="flex flex-col gap-2">
            {!filteredTasks.length ? (
              <p className="text-center text-secondary">
                {!tasks.length
                  ? "You don't have any tasks at the moment"
                  : "You don't have any tasks with this filter"}
              </p>
            ) : (
              filteredTasks.map((task) => (
                <TodoItem
                  key={task.id}
                  data={task}
                  onStatusToggle={handleToggleStatus}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </div>
    )
  }
}
