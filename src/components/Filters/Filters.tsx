import { Component } from "react"
import { SEVERITIES, Severity, SEVERITY_LABELS, Task } from "@/types"
import { cn } from "@/lib/utils"
import { Input, Label, RadioGroup, RadioGroupItem, Switch } from "../ui"
import { debounce } from "@/helpers"
import { FilterValues } from "@/App"

type FiltersProps = {
  searchClassName: string
  filtersClassName: string
  onFilter: (values: FilterValues) => void
  tasks: Task[]
}

type FiltersState = FilterValues

export class Filters extends Component<FiltersProps, FiltersState> {
  constructor(props: FiltersProps) {
    super(props)
    this.state = {
      hideCompletedTasks: false,
      severity: SEVERITIES.default,
      searchValue: "",
    }
  }

  handleToggleFilter = (isChecked: boolean) => {
    const hideCompletedTasks = isChecked
    this.setState({
      hideCompletedTasks,
    })
    // debounce(this.handleFilter, 500)
    this.handleFilter({ ...this.state, hideCompletedTasks })
  }

  handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value
    this.setState({
      searchValue: searchValue,
    })
    // debounce(this.handleFilter, 500)
    this.handleFilter({ ...this.state, searchValue })
  }

  handleChooseSeverity = (severity: Severity) => {
    this.setState({
      severity,
    })
    this.handleFilter({ ...this.state, severity })
  }

  handleFilter = (values: FilterValues) => {
    this.props.onFilter(values)
  }

  render() {
    const { searchClassName, filtersClassName } = this.props
    const { hideCompletedTasks, severity, searchValue } = this.state
    const {
      handleSearchValueChange,
      handleToggleFilter,
      handleChooseSeverity,
    } = this

    return (
      <>
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
            <RadioGroup
              defaultValue={severity}
              onValueChange={handleChooseSeverity}
            >
              {Object.keys(SEVERITY_LABELS).map((labelKey) => (
                <div key={labelKey} className="flex items-center space-x-2">
                  <RadioGroupItem value={labelKey} id={labelKey} />
                  <Label htmlFor={labelKey} className="cursor-pointer">
                    {SEVERITY_LABELS[labelKey as Severity]}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </>
    )
  }
}
