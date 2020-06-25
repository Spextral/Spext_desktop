import { ROLE_TYPES } from '../utils/roleTypes'

export const state = () => ({
  rooms: null,
  // roomInfoList: {},
  // roomId: null,
})

// export const getters = {
//   roomInfo: state => roomId => state.roomInfoList[roomId],
// }

export const mutations = {
  setRooms(state, rooms) {
    state.rooms = rooms
  },
  // setRoomInfo(state, roomInfo) {
  //   state.roomInfoList = {
  //     ...state.roomInfoList,
  //     [roomInfo.id]: roomInfo,
  //   }
  // },
  // setRoomId(state, roomId) {
  //   state.roomId = roomId
  // },
  // toggleOpening(state, roomId) {
  //   const openingRoom = state.rooms.find(room => room.id === roomId)
  //   openingRoom.open = !openingRoom.open
  // },
}

export const actions = {
  async fetchRooms({ commit }) {
    const rooms = [...(await this.$axios.get('/room')).data].reverse()
    commit('setRooms', rooms)
  },

  // async fetchRoomInfo({ commit }, roomId) {
  //   commit('setRoomInfo', await this.$ipc(FETCH_ROOM_INFO, roomId))
  // },

  async createRoom({ dispatch }, name) {
    const room = (await this.$axios.post('/room', { name })).data
    const params = { userId: 1, roomId: room.id, role: ROLE_TYPES[0].id } // 自分のユーザー情報をどう取ってくるか
    await this.$axios.post(`/room/${room.id}/members`, params)
    await dispatch('fetchRooms')
    return room
  },

  // async createNew({ dispatch }, params) {
  //   const item = await this.$ipc(CREATE_NEW, params)
  //   await dispatch('fetchRoomInfo', params.roomId)
  //   return item
  // },

  // async dropFile({ dispatch }, params) {
  //   const item = await this.$ipc(DROP_FILE, params)
  //   await dispatch('fetchRoomInfo', params.roomId)
  //   return item
  // },

  // getRoomId({ commit }, roomId) {
  //   commit('setRoomId', roomId)
  // },
  // async deleteFileInRoom({ dispatch }, { roomId, fileId }) {
  //   await this.$ipc(DELETE_FILE_IN_ROOM, { roomId, fileId })
  //   await dispatch('fetchRoomInfo', roomId)
  // },
}
