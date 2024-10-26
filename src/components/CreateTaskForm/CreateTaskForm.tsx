import { Component, RefObject } from "react"
import { Textarea, Button, Input, Label } from "@/components/ui"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { getUniqueTaskId } from "@/helpers"
import { SEVERITIES, Severity, SEVERITY_LABELS, type Task } from "@/types"

const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 80

type CreateTaskFormProps = {
  inputRef: RefObject<HTMLInputElement>
  onSubmit: (task: Task) => void
}

type CreateTaskFormState = Pick<Task, "title" | "description" | "severity"> & {
  error: string
}

export class CreateTaskForm extends Component<
  CreateTaskFormProps,
  CreateTaskFormState
> {
  constructor(props: CreateTaskFormProps) {
    super(props)
    this.state = {
      title: "",
      description: "",
      severity: SEVERITIES.mid,
      error: "",
    }
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { title, description, severity } = this.state

    if (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH) {
      return this.setState({
        error: `The title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters long`,
      })
    }

    if (title.trim() !== title) {
      return this.setState({
        error: "Title must not begin or end with a space",
      })
    }

    this.props.onSubmit({
      id: getUniqueTaskId(),
      createdAtTimestamp: Math.floor(Date.now() / 1000),
      title,
      description,
      severity,
      isDone: false,
    })

    this.setState({
      title: "",
      description: "",
      error: "",
    })
  }

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: e.target.value })
  }

  handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ description: e.target.value })
  }

  handleSeverityChange = (severity: Severity) => {
    this.setState({ severity })
  }

  render() {
    const {
      handleSubmit,
      handleTitleChange,
      handleDescriptionChange,
      handleSeverityChange,
    } = this
    const { title, description, severity, error } = this.state
    const { inputRef } = this.props

    return (
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter the title of a task"
            value={title}
            onChange={handleTitleChange}
            ref={inputRef}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter the description of a task"
            value={description}
            onChange={handleDescriptionChange}
            rows={6}
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label>Severity</Label>
          <div className="flex gap-2">
            {Object.keys(SEVERITY_LABELS).map((labelKey) => {
              const isActive = severity === labelKey

              return (
                <Button
                  key={labelKey}
                  variant={isActive ? "default" : "outline"}
                  onClick={(e) => {
                    e.preventDefault()
                    handleSeverityChange(labelKey as Severity)
                  }}
                >
                  {SEVERITY_LABELS[labelKey as Severity]}
                </Button>
              )
            })}
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
        <Button type="submit">
          <PlusCircledIcon className="mr-1.5 h-4 w-4" /> Add
        </Button>
      </form>
    )
  }
}
