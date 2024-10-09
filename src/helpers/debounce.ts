// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = (callback: Function, delay: number) => {
  let timeout: NodeJS.Timeout | undefined

  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      callback()
    }, delay)
  }
}
