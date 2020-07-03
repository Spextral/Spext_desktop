export const state = () => ({
  id: null,
  name: null,
  email: null,
  icon: null,
  // usersList: {},
})

// export const getters = {
//   users: (state) => (roomId) => state.usersList[roomId],
//   sortedUsers: (state, getters) => (roomId) =>
//     [...getters.users(roomId)].sort((a, b) => +b.online - a.online),
//   // roleLabel: () => roleId => ROLE_TYPES.find(role => role.id === roleId).label,
// }

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
  // setUsers(state, { roomId, users }) {
  //   state.usersList = {
  //     ...state.usersList,
  //     [roomId]: users,
  //   }
  // },
}

export const actions = {
  async getUserInfo({ commit }) {
    const userInfo = (await this.$axios.get('/user')).data
    commit('setUserInfo', userInfo)
  },
  // async fetchUsers({ commit }, roomId) {
  //   commit('setUsers', {
  //     roomId,
  //     users: await this.$ipc(FETCH_MEMBERS, roomId),
  //   })
  // },
}