import { ROLE_TYPES } from '../utils/roleTypes'

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
    const rooms = [...(await this.$axios.$get('/room'))].reverse()
    commit('setRooms', rooms)
  },

  async fetchRoomInfo({ commit }, roomId) {
    const [members, comments] = await Promise.all([
      this.$axios.$get(`/room/${roomId}/members`),
      this.$axios.$get(`/room/${roomId}/comment`),
    ])
    // const roomInfo = {
    //   id: roomId,
    //   members: members.data,
    //   comments: comments.data,
    // }
    commit('setRoomInfo', {
      id: roomId,
      members,
      comments,
    })
  },
  getroomId({ commit }, roomId) {
    commit('setRoomId', roomId)
  },
  async createRoom({ dispatch }, { userId, name }) {
    const room = await this.$axios.$post('/room', { name })
    const roomId = room.id
    const params = {
      userId,
      role: ROLE_TYPES[0].id,
    } // 自分のユーザー情報をどう取ってくるか
    this.$axios.post(`/room/${roomId}/members`, params)
    dispatch('fetchRooms')
    return room
  },

  addComment({ state, dispatch, getters, commit }, { userId, comment }) {
    const roomId = state.roomId
    const roomInfo = Object.assign({}, getters.roomInfo(roomId))
    const comments = roomInfo.comments
    roomInfo.comments = [
      ...comments,
      {
        content: comment,
        id: comments.length
          ? comments[comments.length - 1].id + 1 + '_temp'
          : '1_temp',
        roomId,
        userId,
      },
    ]
    commit('setRoomInfo', roomInfo)
    this.$axios.post(`/room/${roomId}/comment`, { comment }).then((value) => {
      dispatch('fetchRoomInfo', roomId)
    })
  },

  editComment({ state, dispatch, getters, commit }, { commentId, comment }) {
    const roomId = state.roomId
    const roomInfo = JSON.parse(JSON.stringify(getters.roomInfo(roomId)))
    roomInfo.comments.find(
      (comment) => comment.id === commentId
    ).content = comment
    commit('setRoomInfo', roomInfo)
    axios
      .put(`/room/${roomId}/comment/${commentId}`, { comment })
      .then((value) => {
        dispatch('fetchRoomInfo', roomId)
      })
  },

  setRoomId({ commit, dispatch }, roomId) {
    commit('setRoomId', roomId)
    dispatch('fetchRoomInfo', roomId)
  },
}
