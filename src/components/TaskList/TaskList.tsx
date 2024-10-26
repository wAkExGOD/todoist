import { Component } from "react"
import { TaskItem } from "../TaskItem/TaskItem"
import { Task } from "@/types"

type TaskListProps = {
  tasks: Task[]
  onToggleStatus: (id: Task["id"], isDone: boolean) => void
  onDelete: (id: Task["id"]) => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export class TaskList extends Component<TaskListProps, {}> {
  constructor(props: TaskListProps) {
    super(props)
  }

  render() {
    const { tasks, onToggleStatus, onDelete } = this.props

    return (
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskItem
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
