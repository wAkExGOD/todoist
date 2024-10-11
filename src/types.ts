export const SEVERITIES = {
  low: "low",
  mid: "mid",
  high: "high",
} as const

export const SEVERITY_LABELS = {
  [SEVERITIES.low]: "Low",
  [SEVERITIES.mid]: "Mid",
  [SEVERITIES.high]: "High",
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
