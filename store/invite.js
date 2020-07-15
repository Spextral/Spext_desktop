import { ROLE_TYPES } from '~~/utils/roleTypes'
const axios = require('~/plugins/axios').default
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
    const userId = (await axios.get(`/invite/${email}`)).data
    if (userId !== 'nothing') {
      const params = { userId, roomId, role: ROLE_TYPES[1].id }
      await axios.post(`/room/${roomId}/members`, params).data
    } else {
      await axios.post(`/invite`, { email, roomId })
    }
    commit('setUserInfo', email)
    return '招待しました'
  },
}
