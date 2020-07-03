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
    // eslint-disable-next-line
    console.log(
      'cookieにtokenが保存されているかをチェックする。保存されていればTrue'
    )
    // return this.$ipc(CHECK_LOGIN)
  },
  logout() {
    // eslint-disable-next-line
    console.log('cookieからtokenを削除。')
    // return this.$ipc(LOGOUT)
  },
  prelogin(store, email) {
    // eslint-disable-next-line
    console.log('二段階認証用。emailの確認を要求する。7/2現時点ではなし。')
    // return this.$ipc(PRELOGIN, email)
  },
  async login(store, { email, password }) {
    const token = (await this.$axios.post('/auth/login', { email, password }))
      .data.access_token
    localStorage.setItem('token', JSON.stringify(token))
    // eslint-disable-next-line
    console.log('tokenを取得しcookieに保存',token)
    // return this.$ipc(LOGIN, { email, password })
  },
}
