export default ({ $clearAllIntervals }) => {
  window.addEventListener('beforeunload', $clearAllIntervals)
}
