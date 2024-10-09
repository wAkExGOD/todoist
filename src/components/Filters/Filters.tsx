import { Component } from "react"
import { SEVERITIES, Severity, SEVERITY_LABELS, Task } from "@/types"
import { cn } from "@/lib/utils"
import { Input, Label, RadioGroup, RadioGroupItem, Switch } from "../ui"
import { debounce } from "@/helpers"

type FiltersProps = {
  searchClassName: string
  filtersClassName: string
  onFilter: (tasks: Task[]) => void
  tasks: Task[]
}

type FiltersState = {
  hideCompletedTasks: boolean
  severity: Severity
  searchValue: string
}

export class Filters extends Component<FiltersProps, FiltersState> {
  private filters = {
    hideCompletedTasks: (tasks: Task[]) =>
      tasks
        .sort((t1, t2) => t2.createdAtTimestamp - t1.createdAtTimestamp)
        .filter((task) => task.isDone === false),
    filterTasksByTitle: (tasks: Task[]) =>
      tasks.filter((task) =>
        this.state.searchValue
          ? task.title.toLocaleLowerCase().includes(this.state.searchValue)
          : tasks
      ),
    filterTasksBySeverity: (tasks: Task[]) =>
      tasks.filter((task) => task.severity === this.state.severity),
  }

  constructor(props: FiltersProps) {
    super(props)
    this.state = {
      hideCompletedTasks: false,
      severity: SEVERITIES.default,
      searchValue: "",
    }
  }

  handleToggleFilter = (isChecked: boolean) => {
    this.setState({
      hideCompletedTasks: isChecked,
    })
    debounce(this.handleFilter, 500)
  }

  handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchValue: e.target.value,
    })
    debounce(this.handleFilter, 500)
  }

  handleFilter = () => {
    const filteredTasks = Object.values(this.filters).reduce(
      (tasks, cur) => cur(tasks),
      this.props.tasks
    )

    this.props.onFilter(filteredTasks)
  }

  render() {
    const { searchClassName, filtersClassName } = this.props
    const { hideCompletedTasks, severity, searchValue } = this.state
    const { filters, handleSearchValueChange, handleToggleFilter } = this

    console.log(filters)

    return (
      <div>
        <div className={searchClassName}>
          <Input
            value={searchValue}
            onChange={handleSearchValueChange}
            placeholder="Search todo"
          />
        </div>
        <div className={cn(filtersClassName, "flex flex-col gap-4")}>
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
          <div className="grid w-full items-center gap-1.5">
            <Label>Severity</Label>
            <RadioGroup defaultValue={severity}>
              {Object.keys(SEVERITY_LABELS).map((labelKey) => (
                <div key={labelKey} className="flex items-center space-x-2">
                  <RadioGroupItem value={labelKey} id={labelKey} />
                  <Label htmlFor={labelKey}>
                    {SEVERITY_LABELS[labelKey as Severity]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </div>
    )
  }
}
