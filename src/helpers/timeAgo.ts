export const timeAgo = (timestamp: number) => {
  const now = Date.now()
  const secondsPast = Math.floor((now - timestamp * 1000) / 1000)

  if (secondsPast < 60) {
    return `${secondsPast} seconds ago`
  } else if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60)
    return `${minutes} minutes ago`
  } else if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600)
    return `${hours} hours ago`
  } else if (secondsPast < 604800) {
    const days = Math.floor(secondsPast / 86400)
    return `${days} days ago`
  } else {
    const weeks = Math.floor(secondsPast / 604800)
    return `${weeks} weeks ago`
  }
}
