export const state = () => ({
  email: null,
})

export const mutations = {
  setEmail(state, email) {
    state.email = email
  },
}

export const actions = {
  checkLogin() {
    return localStorage.getItem('token')
  },
  logout() {
    localStorage.removeItem('token')
  },
  prelogin(store, email) {
    // console.log('二段階認証用。emailの確認を要求する。7/2現時点ではなし。')
    // return this.$ipc(PRELOGIN, email)
  },
  async login(store, { email, password }) {
    const token = (await this.$axios.post('/auth/login', { email, password }))
      .data.access_token
    localStorage.setItem('token', JSON.stringify(token))
  },
}
