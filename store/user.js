export const state = () => ({
  id: null,
  name: null,
  email: null,
  icon: null,
  usersList: {},
})

export const getters = {
  users: (state) => (roomId) => state.usersList[roomId],
  sortedUsers: (state, getters) => (roomId) => {
    if (getters.users(roomId)) {
      const mapped = getters.users(roomId).map((user, i) => {
        if (user.id === state.id) {
          return { index: i, value: 0 }
        } else {
          return { index: i, value: 1 }
        }
      })
      mapped.sort((a, b) => a.value - b.value)
      const result = mapped.map(function (el) {
        return getters.users(roomId)[el.index]
      })
      return result
    }
  },
  // roleLabel: () => roleId => ROLE_TYPES.find(role => role.id === roleId).label,
}

export const mutations = {
  setUserInfo(state, { id, name, email, icon }) {
    state.id = id
    state.name = name
    state.email = email
    state.icon = icon
  },
  clearUserInfo(state) {
    state.name = null
    state.email = null
    state.icon = null
  },
  setUsers(state, { roomId, users }) {
    state.usersList = {
      ...state.usersList,
      [roomId]: users,
    }
  },
}

export const actions = {
  async getUserInfo({ commit }) {
    const userInfo = await this.$axios.$get('/user')
    commit('setUserInfo', userInfo)
  },
  async fetchUsers({ commit }, roomId) {
    commit('setUsers', {
      roomId,
      users: await this.$axios.$get(`/room/${roomId}/members`),
    })
  },
}
