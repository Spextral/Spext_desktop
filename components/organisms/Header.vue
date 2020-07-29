<template>
  <div :class="containerClass" class="ft-container">
    <user :name="name" :icon="icon" @logout="logout" />
  </div>
</template>

<script>
import {
  mapState,
  // mapGetters
} from 'vuex'
import User from '~/components/atoms/User'

export default {
  components: {
    User,
  },
  computed: {
    ...mapState('user', ['name', 'icon']),
    containerClass() {
      return { isMac: this.$platform === 'mac' }
    },
  },
  methods: {
    async logout() {
      await this.$store.dispatch('login/logout')
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.ft-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--titlebar-height);
  background: var(--color-title-bar);
}

.ft-container.isMac {
  margin-right: 5px;
  margin-left: 64px;
}
</style>
