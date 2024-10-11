import { Severities } from "@/App"
import { Severity } from "@/types"

export const compareSeverities = (
  severities1: Severities,
  severities2: Severities
) => {
  for (const key in severities1) {
    const severity = key as Severity

    if (severities1[severity] !== severities2[severity]) {
      return false
    }
  }

  return true
}
