<template>
  <div v-if="roomId">
    <!-- <loading-panel v-if="loading" /> -->
    <div v-if="file(fileId)" class="comments-container">
      <div
        v-for="comment in file(fileId).commits[0].comments"
        :key="comment.id"
        class="comment"
      >
        <div class="comment-body">
          <div class="comment-message">{{ comment.content }}</div>
        </div>
      </div>
    </div>
    <div class="comments-panel">
      <form class="comment-input" @submit.prevent="submitComment">
        <input
          v-model="newComment"
          type="text"
          placeholder="Input comment..."
        />
      </form>
      <el-button @click="toggleMichrophone">マイク</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import LoadingPanel from '~/components/atoms/LoadingPanel'

export default {
  // components: {
  //   LoadingPanel,
  // },
  data() {
    // eslint-disable-next-line
    const speech = new window.webkitSpeechRecognition()
    speech.lang = 'ja-JP'
    speech.onresult = async (e) => {
      speech.stop()
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (!e.results[i].isFinal) continue
        const { transcript } = e.results[i][0]
        if (transcript) {
          await this.$store.dispatch('file/addComment', {
            roomId: this.roomId,
            fileId: this.fileId,
            commitId: this.currentCommitId(this.fileId),
            userId: this.$store.state.user.id,
            comment: transcript,
          })
        }
      }
    }
    speech.onend = () => {
      if (this.michrophoneEnabled) {
        speech.start()
      }
    }
    return {
      newComment: '',
      michrophoneEnabled: false,
      speech,
      // loading: true,
    }
  },
  computed: {
    ...mapState('room', ['roomId']),
    ...mapGetters('room', ['roomInfo']),
    ...mapGetters('file', ['file', 'currentCommitId']),
    fileId() {
      return this.roomInfo(this.roomId)
        ? this.roomInfo(this.roomId).items[0].id
        : null
    },
    // user() {
    //   return id => this.users.find(user => user.id === id)
    // },
    // circleStyle() {
    //   return icon => ({ backgroundImage: `url(${icon})` })
    // },
  },
  // mounted() {
  //   this.loading = false
  // },
  methods: {
    async submitComment() {
      const message = this.newComment
      if (message) {
        await this.$store.dispatch('file/addComment', {
          roomId: this.roomId,
          fileId: this.fileId,
          commitId: this.currentCommitId(this.fileId),
          userId: this.$store.state.user.id,
          comment: message,
        })
        this.newComment = ''
      }
    },
    toggleMichrophone() {
      this.michrophoneEnabled = !this.michrophoneEnabled
      if (this.michrophoneEnabled) {
        this.speech.start()
        // eslint-disable-next-line
        console.log('start')
      } else {
        this.speech.stop()
        // eslint-disable-next-line
        console.log('stop')
      }
    },
    // Warning(warningText) {
    //   this.$emit('openModal', warningText)
    // },
  },
}
</script>

<style scoped>
.commit-container {
  user-select: text;
  padding-top: 30px;
  height: 100%;
  overflow: auto;
}

.commit-container-modified-true {
  user-select: text;
  padding-top: 30px;
  height: calc(100% - var(--commit-maker-height));
  overflow: auto;
}

.commit-container-modified-true > div,
.commit-container > div {
  position: relative;
}

.commit-container-modified-true img,
.commit-container img {
  user-select: none;
}

.commit-container-modified-true .comments-panel .file-controls,
.commit-container .comments-panel .file-controls {
  opacity: 0;
}

.commit-container-modified-true .comments-panel:hover .file-controls,
.commit-container .comments-panel:hover .file-controls {
  opacity: 1;
}

.comments-container {
  width: 100%;
  height: 80%;
  right: 0;
  top: 0; /* left: var(--commit-graph-left); */
  bottom: 0;
}

.commit-circle {
  width: var(--commit-circle-size);
  height: var(--commit-circle-size);
  border-radius: 50%;
  background: center/cover no-repeat;
}

.enhance {
  border-style: solid;
  border-color: green;
  border-width: 3pt;
}

.commit-line {
  width: 5px;
  position: absolute;
  top: var(--commit-circle-size);
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  background: var(--color-blue);
}

.comments-panel {
  bottom: 0;
  right: 0;
  margin-left: 90px;
  margin-right: 30px; /* padding-bottom: 40px; */
}

.comments-panel .comment {
  position: relative;
  margin-top: 12px;
}

.comments-panel .comment-circle {
  width: var(--comment-circle-size);
  height: var(--comment-circle-size);
  border-radius: 50%;
  background: center/cover no-repeat;
  position: absolute;
  top: 3px;
  left: 0;
}

.comments-panel .comment-body {
  margin-left: var(--comment-circle-size);
  padding-left: 15px;
}

.comments-panel .committer-info {
  position: relative;
  padding-right: 70px;
}

.comments-panel .committer-info .file-controls .file-controls-icon {
  display: inline-block;
  padding: 3px;
  cursor: pointer;
  margin-left: 5px;
  margin-top: -4px;
  font-size: 18px;
  color: var(--color-border);
  transition: 0.2s;
}

.comments-panel .committer-info .file-controls .file-controls-icon:hover {
  color: unset;
}

.comments-panel .committer-name,
.comments-panel .comment-username {
  font-weight: bold;
  display: inline-block;
}

.comments-panel .committer-date,
.comments-panel .comment-date {
  font-size: 12px;
  color: var(--color-date);
}

.comments-panel .committer-message {
  padding: 2px 15px 10px 0;
}

.comments-panel .comment-input {
  margin-top: 25px;
}

.comments-panel .comment-input input {
  border: none;
  background: var(--color-sub);
  font-size: 16px;
  padding: 10px;
  width: 100%;
  color: var(--font-base);
  border-radius: 5px;
  user-select: none;
}

.comments-panel .comment-input input::placeholder {
  color: var(--color-date);
  font-size: 14px;
}

.comments-panel .comment-input input:focus {
  outline: none;
}

.commit-maker {
  height: var(--commit-maker-height);
  border-top: 1px solid var(--color-border);
  position: relative;
}

.commit-maker .comments-panel {
  padding-top: 1px;
}

.commit-maker .commit-maker-graph {
  position: absolute;
  top: 18px;
  left: var(--commit-graph-left);
}

.commit-maker .comment-maker-text {
  font-size: 12px;
  color: var(--font-base);
  overflow: hidden;
  white-space: nowrap;
}

.commit-maker .comment-input {
  margin-top: 12px;
}

.blink {
  animation: blinkAnime 0.8s infinite alternate;
}

@keyframes blinkAnime {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.dialog >>> .el-dialog__body {
  padding: 20px 40px 50px;
}

.dialog >>> .v-modal,
.dialog >>> .el-dialog__wrapper {
  top: var(--titlebar-height);
}
</style>
