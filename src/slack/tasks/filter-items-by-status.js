module.exports = (itemsByStatus, statusQuery) => {
  const itemStatus = Object.keys(itemsByStatus)
  if (statusQuery) {
    return itemStatus.filter(status => status.toLowerCase().includes(statusQuery.toLowerCase()))
  }
  return itemStatus
}
