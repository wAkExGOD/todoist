export const SEVERITIES = {
  immediately: "immediately",
  default: "default",
  notImmediately: "notImmediately",
} as const

export const SEVERITY_LABELS = {
  [SEVERITIES.default]: "Default",
  [SEVERITIES.immediately]: "Immediately",
  [SEVERITIES.notImmediately]: "Not immediately",
} as const

export type Severity = keyof typeof SEVERITIES

export type Task = {
  id: string
  title: string
  description: string
  createdAtTimestamp: number
  isDone: boolean
  severity: Severity
}
