<template>
  <div>
    <div v-for="room in rooms" :key="room.id" class="room">
      <span>{{ room.name }}</span>
    </div>
  </div>
</template>

<script>
// import { mapState } from 'vuex'
// import LoadingPanel from '~/components/atoms/LoadingPanel'
// import axios from 'axios'

export default {
  // components: {
  //   LoadingPanel,
  // },
  data() {
    return {
      rooms: [
        { name: 'test1', id: '1' },
        { name: 'test2', id: '2' },
      ],
    }
  },
  // computed: {
  //   ...mapState('room', ['rooms']),
  // },
  async created() {
    // await this.$store.dispatch('room/fetchRooms')
    // this.loading = false
    // console.log((await this.$axios.$get('/room')).data)
  },
  // methods: {
  //   async openRoomNamePrompt() {
  //     const { value } = await this.$prompt('Please input name', 'Create new room', {
  //       confirmButtonText: 'OK',
  //       cancelButtonText: 'Cancel',
  //       inputPattern: /^[a-z0-9]{3,20}$/,
  //       inputErrorMessage: 'Invalid name',
  //     }).catch(() => ({}))

  //     if (!value) return

  //     const room = await this.$store.dispatch('room/createRoom', value)
  //     await this.enterRoom(room.id)
  //   },
  //   async enterRoom(roomId) {
  //     await this.$store.dispatch('tab/changeTabType', {
  //       id: this.currentTabId,
  //       type: TAB_TYPES.FOLDER,
  //       values: { roomId, folder: '' },
  //     })
  //   },
  // },
}
</script>

<style scoped>
.room {
  display: block;
  height: 26px;
  margin-top: 0.25rem;
  padding-left: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s color, background-color ease;
  position: relative;
}
</style>
