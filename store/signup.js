const axios = require('~/plugins/axios').default

export const actions = {
  signup(store, { name, email, password }) {
    axios.post('/user', { name, email, password })
  },
}
