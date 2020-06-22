<template>
  <div class="container">
    <room-view class="room-container" />
    <talk-view class="talk-container" />
  </div>
</template>

<script>
import RoomView from '~/components/organisms/RoomView'
import TalkView from '~/components/organisms/TalkView'

export default {
  components: {
    RoomView,
    TalkView,
  },
}
</script>

<style>
.container {
  display: flex;
}

.room-container {
  height: 100%;
  overflow: auto;
  color: var(--font-sub);
  flex: 2;
  position: relative;
}

.talk-container {
  height: 100%;
  overflow: auto;
  color: var(--font-sub);
  position: relative;
  flex: 3;
}
</style>
