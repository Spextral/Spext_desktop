<template>
  <div>
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
.room-container {
  height: 100%;
  overflow: auto;
  color: var(--font-sub);
  position: absolute;
  left: 0;
  right: calc(100% - var(--room-ratio));
}

.talk-container {
  height: 100%;
  color: var(--font-sub);
  position: absolute;
  left: var(--room-ratio);
  right: 0;
}
</style>
