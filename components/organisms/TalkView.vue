<template>
  <div v-if="roomId">
    <!-- <loading-panel v-if="loading" /> -->
    <div class="comment-view">
      <div v-if="roomInfo(roomId)" class="comments-container">
        <div
          v-for="comment in roomInfo(roomId).comments"
          :key="comment.id"
          class="comment"
        >
          <div
            class="comment-body"
            :class="[comment.user_id == id ? 'right-flush' : 'left-flush']"
          >
            <i
              v-if="comment.user_id == id"
              class="fas fa-edit"
              @click="openCommentEditPrompt(comment)"
            />
            <div class="comment-message">
              {{ comment.content }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="comments-container"></div>
      <div class="comments-panel">
        <div
          class="michrophone-button"
          :class="{ 'border-red': michrophoneEnabled }"
        >
          <i
            class="fa fa-2x"
            :class="[
              michrophoneEnabled ? 'fa-microphone' : 'fa-microphone-slash',
            ]"
            @click="toggleMichrophone"
          />
        </div>
        <form class="comment-input" @submit.prevent="submitComment">
          <input
            v-model="newComment"
            type="text"
            placeholder="Input comment..."
          />
        </form>
      </div>
    </div>
    <members-item :room-id="roomId" class="folder-members" />
  </div>
  <div v-else class="talk-container"></div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import MembersItem from '~/components/molecules/MembersItem'
// import LoadingPanel from '~/components/atoms/LoadingPanel'

export default {
  components: {
    MembersItem,
    // LoadingPanel,
  },
  data() {
    // eslint-disable-next-line
    const speech = new window.webkitSpeechRecognition()
    speech.lang = 'ja-JP'
    speech.onresult = (e) => {
      speech.stop()
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (!e.results[i].isFinal) continue
        const { transcript } = e.results[i][0]
        if (transcript) {
          this.$store.dispatch('room/addComment', {
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
    ...mapState('user', ['id']),
    ...mapGetters('room', ['roomInfo']),
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
    submitComment() {
      const message = this.newComment
      if (message) {
        this.$store.dispatch('room/addComment', {
          userId: this.id,
          comment: message,
        })
        this.newComment = ''
      }
    },
    async openCommentEditPrompt(comment) {
      const { value } = await this.$prompt(
        `Please input new message (now: ${comment.content})`,
        'Edit message',
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
        }
      ).catch(() => ({}))

      if (!value) return

      this.$store.dispatch('room/editComment', {
        commentId: comment.id,
        comment: value,
      })
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
.comment-view {
  height: 100%;
  position: fixed;
  left: inherit;
  right: var(--members-opening-width);
}

.comments-container {
  height: calc(100% - 60px);
  overflow: auto;
}

.comment .comment-body i {
  cursor: pointer;
}

.comment .comment-body .comment-message {
  border: solid;
  border-width: 1px;
  border-radius: 10px;
  display: inline-block;
  font-size: 18px;
  padding-inline: 3px;
  margin: 3px;
  word-wrap: break-word;
  max-width: 80%;
  text-align: left;
}

.comment .left-flush {
  text-align: left;
}

.comment .right-flush {
  text-align: right;
}

.comment .right-flush .comment-message {
  background-color: var(--color-blue);
  font-weight: 500;
}

/* .comments-panel .comment-circle {
  width: var(--comment-circle-size);
  height: var(--comment-circle-size);
  border-radius: 50%;
  background: center/cover no-repeat;
  position: absolute;
  top: 3px;
  left: 0;
} */

/* .comments-panel .comment-body {
  margin-left: var(--comment-circle-size);
  padding-left: 15px;
} */

/* .comments-panel .committer-info {
  position: relative;
  padding-right: 70px;
} */

/* .comments-panel .comment-username {
  font-weight: bold;
  display: inline-block;
} */

/* .comments-panel .comment-date {
  font-size: 12px;
  color: var(--color-date);
} */

.comments-panel .comment-input {
  width: calc(100% - 70px);
  display: inline-block;
}

.comments-panel .comment-input input {
  border: none;
  background: var(--color-sub);
  font-size: 20px;
  padding: 12px;
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

.comments-panel .michrophone-button {
  height: 48px;
  width: 60px;
  border: solid;
  opacity: 60%;
  border-radius: 6px;
  padding: 3px 6px;
  display: inline-block;
  cursor: pointer;
  text-align: center;
}

.comments-panel .border-red {
  border-color: red;
}

.comments-panel .michrophone-button i {
  padding-top: 1px;
}

.comments-panel .michrophone-button:hover {
  opacity: unset;
}

.comments-panel .michrophone-button .fa-microphone {
  color: red;
}

/* .blink {
  animation: blinkAnime 0.8s infinite alternate;
}

@keyframes blinkAnime {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
} */

.dialog >>> .el-dialog__body {
  padding: 20px 40px 50px;
}

.dialog >>> .v-modal,
.dialog >>> .el-dialog__wrapper {
  top: var(--titlebar-height);
}

.folder-members {
  height: 100%;
  overflow: auto;
  position: fixed;
  right: 0;
  left: calc(100% - var(--members-opening-width));
}
</style>
