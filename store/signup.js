export const actions = {
  signup(store, { name, email, password }) {
    this.$axios.post('/user', { name, email, password })
  },
}
