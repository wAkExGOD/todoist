import { Component } from "react"
import { TodoItem } from "../TodoItem/TodoItem"
import { Task } from "@/types"

type TodoListProps = {
  tasks: Task[]
  onToggleStatus: (id: Task["id"], isDone: boolean) => void
  onDelete: (id: Task["id"]) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class TodoList extends Component<TodoListProps, {}> {
  constructor(props: TodoListProps) {
    super(props)
  }

  render() {
    const { tasks, onToggleStatus, onDelete } = this.props

    return (
      <div className="flex flex-col gap-2">
        {/* {!tasks.length ? (
            <p className="text-center text-secondary">
              {!tasks.length
                ? "You don't have any tasks at the moment"
                : "You don't have any tasks with this filter"}
            </p>
          ) : ( */}
        {tasks.map((task) => (
          <TodoItem
            key={task.id}
            data={task}
            onToggleStatus={onToggleStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
    )
  }
}
