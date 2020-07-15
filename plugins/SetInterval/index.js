import Vue from 'vue'

let intervals = []

Vue.prototype.$setInterval = (func, intervalMilliSec) => {
  if (typeof process.env.VUE_APP_DISABLE_SET_INTERVAL !== 'undefined') {
    // eslint-disable-next-line
    console.log(`[DISABLE_SET_INTERVAL] Check environment vars`)
    return null
  }
  const id = setInterval(() => {
    if (document.visibilityState === 'visible') {
      func()
    }
  }, intervalMilliSec)
  intervals.push(id)
  return id
}
Vue.prototype.$clearInterval = (id) => {
  clearInterval(id)
  intervals = intervals.filter((i) => i !== id)
}
Vue.prototype.$clearAllIntervals = () => {
  intervals.forEach(this.clearInterval)
  intervals = []
}
