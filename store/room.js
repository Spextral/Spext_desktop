import { ROLE_TYPES } from '../utils/roleTypes'
const FormData = require('form-data')

export const state = () => ({
  rooms: null,
  roomInfoList: {},
  roomId: null,
})

export const getters = {
  roomInfo: (state) => (roomId) => state.roomInfoList[roomId],
}

export const mutations = {
  setRooms(state, rooms) {
    state.rooms = rooms
  },
  setRoomInfo(state, roomInfo) {
    state.roomInfoList = {
      ...state.roomInfoList,
      [roomInfo.id]: roomInfo,
    }
  },
  setRoomId(state, roomId) {
    state.roomId = roomId
  },
}

export const actions = {
  async fetchRooms({ commit }) {
    const rooms = [...(await this.$axios.get('/room')).data].reverse()
    commit('setRooms', rooms)
  },

  async fetchRoomInfo({ commit }, roomId) {
    commit('setRoomInfo', (await this.$axios.get(`/room/${roomId}`)).data)
  },

  async createRoom({ dispatch }, name) {
    const room = (await this.$axios.post('/room', { name })).data
    const roomId = room.id
    const params = { userId: 1, roomId, role: ROLE_TYPES[0].id } // 自分のユーザー情報をどう取ってくるか
    await this.$axios.post(`/room/${roomId}/members`, params)
    const form = new FormData()
    form.append('extname', 'pdf')
    form.append('name', 'a')
    await this.$axios.post(`/room/${roomId}/file`, form)
    await dispatch('fetchRooms')
    return room
  },

  // async addComment({ state, dispatch }, params) {
  //   const roomId = state.roomId
  //   const item = await this.$ipc(DROP_FILE, params)
  //   const fileId = item.file.id
  //   const commitId = item.commitId
  //   await this.$ipc(ADD_COMMENT, { roomId, fileId, commitId, comment: item.commit.message })
  //   await dispatch('fetchRoomInfo', roomId)
  //   return item
  // },

  async setRoomId({ commit, dispatch }, roomId) {
    commit('setRoomId', roomId)
    await dispatch('fetchRoomInfo', roomId)
  },
}
