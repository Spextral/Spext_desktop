<template>
  <div>
    <loading-panel v-if="loading" />
    <div class="controls room">
      <i
        class="fas fa-folder-plus"
        title="Create new room"
        @click="openRoomNamePrompt"
      />
    </div>
    <div
      v-for="room in sortedRooms"
      :key="room.id"
      class="room"
      @click="enterRoom(room.id)"
    >
      <span>{{ room.name }}</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import LoadingPanel from '~/components/atoms/LoadingPanel'

export default {
  components: {
    LoadingPanel,
  },
  data() {
    return {
      loading: true,
      intervalIdOfViewingRoom: null,
    }
  },
  computed: {
    ...mapState('room', ['rooms']),
    ...mapState('user', ['id']),
    ...mapGetters('room', ['roomInfo', 'sortedRooms']),
  },
  async created() {
    await this.$store.dispatch('room/fetchRooms')
    this.loading = false
    this.$setInterval(() => {
      this.$store.dispatch('room/fetchRooms')
    }, 30000)
    for (const room of this.rooms) {
      const roomId = room.id
      this.$store.dispatch('room/fetchRoomInfo', roomId)
      this.$store.dispatch('user/fetchUsers', roomId)
    }
    this.$setInterval(async () => {
      for (const room of this.rooms) {
        const roomId = room.id
        await this.$store.dispatch('room/fetchRoomInfo', roomId)
        await this.$store.dispatch('user/fetchUsers', roomId)
      }
    }, 30000)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.$clearAllIntervals)
  },
  methods: {
    async openRoomNamePrompt() {
      const { value } = await this.$prompt(
        'Please input name',
        'Create new room',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          inputPattern: /^[a-z0-9]{3,20}$/,
          inputErrorMessage: 'Invalid name',
        }
      ).catch(() => ({}))

      if (!value) return

      const room = await this.$store.dispatch('room/createRoom', {
        userId: this.id,
        name: value,
      })
      this.enterRoom(room.id)
    },
    enterRoom(roomId) {
      if (this.intervalIdOfViewingRoom) {
        this.$clearInterval(this.intervalIdOfViewingRoom)
      }
      this.$store
        .dispatch('room/setRoomId', null)
        .then(() => this.$store.dispatch('room/setRoomId', roomId))
      this.intervalIdOfViewingRoom = this.$setInterval(() => {
        this.$store.dispatch('room/fetchRoomInfo', roomId)
        this.$store.dispatch('user/fetchUsers', roomId)
      }, 10000)
    },
    logout() {
      this.$store.dispatch('login/logout')
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.room {
  display: block;
  height: 52px;
  margin-top: 0.25rem;
  padding-left: 12px;
  font-size: 20px;
  cursor: pointer;
  transition: 0.2s color, background-color ease;
  position: relative;
}
.controls {
  cursor: auto;
  text-align: right;
  padding: 8px 20px;
}
.controls i {
  cursor: pointer;
  font-size: 16px;
}
</style>
