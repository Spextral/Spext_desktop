import { ROLE_TYPES } from '~~/utils/roleTypes'
export const state = () => ({
  email: null,
})

export const mutations = {
  setUserInfo(state, email) {
    state.email = email
  },
  clearUserInfo(state) {
    state.email = null
  },
}

export const actions = {
  async getUserInfo({ commit }, { email, roomId }) {
    const userId = await this.$axios.$get(`/invite/${email}`)
    if (userId !== 'nothing') {
      const params = { userId, roomId, role: ROLE_TYPES[1].id }
      await this.$axios.post(`/room/${roomId}/members`, params)
    } else {
      await this.$axios.post(`/invite`, { email, roomId })
    }
    commit('setUserInfo', email)
    return '招待しました'
  },
}
