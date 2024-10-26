import { Component } from "react"
import { SEVERITY_LABELS, type Task } from "@/types"
import { cn } from "@/lib/utils"
import { timeAgo } from "@/helpers"
import { Button, Checkbox } from "@/components/ui"
import { TrashIcon } from "@radix-ui/react-icons"
import styles from "./TaskItem.module.css"

type TaskItemProps = {
  data: Task
  onToggleStatus: (id: Task["id"], isDone: boolean) => void
  onDelete: (id: Task["id"]) => void
}

export class TaskItem extends Component<TaskItemProps> {
  constructor(props: TaskItemProps) {
    super(props)
  }

  handleToggleStatus = (isDone: boolean) =>
    this.props.onToggleStatus(this.props.data.id, isDone)

  handleDelete = () => this.props.onDelete(this.props.data.id)

  shouldComponentUpdate(nextProps: Readonly<TaskItemProps>): boolean {
    const hasTitleChanged = nextProps.data.title !== this.props.data.title
    const hasDoneStatusChange = nextProps.data.isDone !== this.props.data.isDone

    if (hasTitleChanged || hasDoneStatusChange) {
      return true
    }

    return false
  }

  render() {
    const { handleToggleStatus, handleDelete } = this
    const { title, description, createdAtTimestamp, isDone, severity } =
      this.props.data

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
              {severity && (
                <p className="text-emerald-500">
                  Severity: {SEVERITY_LABELS[severity]}
                </p>
              )}
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
