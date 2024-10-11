import { Component } from "react"
import { Severity, SEVERITY_LABELS } from "@/types"
import { cn } from "@/lib/utils"
import { Checkbox, Input, Label, Switch } from "../ui"
import { debounce } from "@/helpers"
import {
  FilterValues,
  HandleSetHideCompletedTasks,
  HandleSetSearchValue,
  HandleSetSeverities,
} from "@/App"

type FiltersProps = {
  searchClassName: string
  filtersClassName: string
  filterValues: FilterValues
  handleSetHideCompletedTasks: HandleSetHideCompletedTasks
  handleSetSeverities: HandleSetSeverities
  handleSetSearchValue: HandleSetSearchValue
}

type FiltersState = FilterValues

export class Filters extends Component<FiltersProps, FiltersState> {
  constructor(props: FiltersProps) {
    super(props)
    this.state = {
      searchValue: this.props.filterValues.searchValue,
      severities: this.props.filterValues.severities,
      hideCompletedTasks: this.props.filterValues.hideCompletedTasks,
    }
  }

  handleToggleHideStatus = (hideCompletedTasks: boolean) => {
    this.setState({
      hideCompletedTasks,
    })

    this.debouncedToggleHideStatus()
  }

  handleChangeSeverity = (severity: Severity, checked: boolean) => {
    this.setState((state) => ({
      ...state,
      severities: {
        ...state.severities,
        [severity]: checked,
      },
    }))

    this.debouncedChangeSeverities()
  }

  handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchValue: e.target.value,
    })

    this.debouncedSearch()
  }

  debouncedSearch = debounce(() => {
    this.props.handleSetSearchValue(this.state.searchValue)
  }, 500)
  debouncedChangeSeverities = debounce(() => {
    this.props.handleSetSeverities(this.state.severities)
  }, 500)
  debouncedToggleHideStatus = debounce(() => {
    this.props.handleSetHideCompletedTasks(this.state.hideCompletedTasks)
  }, 500)

  render() {
    const { searchClassName, filtersClassName } = this.props
    const { searchValue, severities, hideCompletedTasks } = this.state
    const {
      handleSearchValueChange,
      handleToggleHideStatus,
      handleChangeSeverity,
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
          <div className="flex items-center space-x-2 p-3 rounded-md border">
            <Switch
              id="only-uncompleted-tasks"
              checked={hideCompletedTasks}
              onCheckedChange={handleToggleHideStatus}
            />
            <Label htmlFor="only-uncompleted-tasks" className="cursor-pointer">
              Hide completed tasks
            </Label>
          </div>
          <div className="grid w-full items-center gap-3 p-3 rounded-md border">
            <Label>Severity</Label>
            <div className="flex flex-col gap-2">
              {Object.keys(SEVERITY_LABELS).map((labelKey) => (
                <div className="flex items-center space-x-2" key={labelKey}>
                  <Checkbox
                    id={labelKey}
                    checked={severities[labelKey as Severity]}
                    onCheckedChange={(checked) => {
                      const status =
                        checked === "indeterminate" ? false : checked

                      handleChangeSeverity(labelKey as Severity, status)
                    }}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {SEVERITY_LABELS[labelKey as Severity]}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    )
  }
}
