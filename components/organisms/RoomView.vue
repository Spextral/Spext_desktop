<template>
  <div>
    <loading-panel v-if="loading" />
    <el-button @click="logout">ログアウト</el-button>
    <div class="controls room">
      <i
        class="fas fa-folder-plus"
        title="Create new room"
        @click="openRoomNamePrompt"
      />
    </div>
    <div
      v-for="room in rooms"
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
    ...mapGetters('room', ['roomInfo']),
  },
  async created() {
    await this.$store.dispatch('room/fetchRooms')
    this.loading = false
    this.$setInterval(() => {
      this.$store.dispatch('room/fetchRooms')
    }, 10000)
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
      this.$store.dispatch('room/setRoomId', roomId)
      this.intervalIdOfViewingRoom = this.$setInterval(() => {
        this.$store.dispatch('room/fetchRoomInfo', roomId)
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
  height: 26px;
  margin-top: 0.25rem;
  padding-left: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: 0.2s color, background-color ease;
  position: relative;
}
.controls {
  text-align: right;
  padding: 8px 20px;
}
.controls .i {
  cursor: pointer;
  font-size: 16px;
}
</style>
