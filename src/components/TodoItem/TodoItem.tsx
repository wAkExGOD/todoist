import { Component } from "react"
import { type Task } from "@/types"
import { cn } from "@/lib/utils"
import { timeAgo } from "@/helpers"
import { Button, Checkbox } from "@/components/ui"
import { TrashIcon } from "@radix-ui/react-icons"
import styles from "./TodoItem.module.css"

type TodoItemProps = {
  data: Task
  onStatusToggle: (id: Task["id"], isDone: boolean) => void
  onDelete: (id: Task["id"]) => void
}

export class TodoItem extends Component<TodoItemProps> {
  constructor(props: TodoItemProps) {
    super(props)
  }

  handleToggleStatus = (isDone: boolean) => {
    const { onStatusToggle, data } = this.props

    onStatusToggle(data.id, isDone)
  }

  handleDelete = () => {
    const { onDelete, data } = this.props

    onDelete(data.id)
  }

  render() {
    const { handleToggleStatus, handleDelete } = this
    const { title, description, createdAtTimestamp, isDone } = this.props.data

    return (
      <div className={cn(styles.container, "px-5 py-5 rounded-md border")}>
        <div className={cn(styles.info, "relative overflow-hidden")}>
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isDone}
              onCheckedChange={handleToggleStatus}
              className="w-6 h-6 rounded-full"
            />
            <div className="flex flex-col gap-1 max-w-[calc(100%-140px)]">
              <p className="font-medium text-xl leading-none break-words">
                {title}
              </p>
              {description && <p className="text-emerald-600">{description}</p>}
            </div>
            <div className={cn(styles.deleteButton, "ml-auto self-center")}>
              <Button variant="outline" onClick={handleDelete}>
                <TrashIcon className="mr-1 -ml-1 h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
          <div className={cn(styles.date, "text-green-700 text-right")}>
            {timeAgo(createdAtTimestamp)}
          </div>
        </div>
      </div>
    )
  }
}
