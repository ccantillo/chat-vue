<template>
  <div class="chat-box" :class="[isPreview ? '' : 'none']">
    <form class="send-form" novalidate @submit.prevent="$emit('createRoom')">
      <div class="send-box">
        <label for="form-label" class="form-label">Napisz wiadomość</label>
        <input
          type="text"
          class="send-input input"
          :value="roomName"
          autocomplete="off"
          placeholder="Room name"
          @input="(event) => $emit('update:roomName', event.target.value)"
        />
        <div v-if="errorSendMsg" class="error-message">
          {{ errorSendMsg }}
        </div>
      </div>
      <div class="btn-box">
        <button class="btn send-button" type="submit">Create room</button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, nextTick, onUpdated } from "vue";

export default {
  props: {
    isPreview: {
      type: Boolean,
      required: true,
    },
    roomName: {
      type: String,
      required: false,
    },
    messages: {
      type: Array,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    isTyping: {
      type: Boolean,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    errorSendMsg: {
      type: String,
      required: true,
    },
  },
  emits: [
    "sendMessage",
    "update:message",
    "validateMessage",
    "createRoom",
    "update:roomName",
  ],
  setup() {
    let chatArea = ref(null);
    let refscrollHeight = ref(null);

    const update = () => {
      nextTick(() => {});
    };

    onUpdated(update);

    return {
      update,
      chatArea,
      refscrollHeight,
    };
  },
};
</script>

<style lang="scss" scoped>
.chat-box {
  width: 100%;
  height: 100%;
  margin: 1rem;
  .chat-area {
    width: 100%;
    height: 100%;
    box-shadow: 7px 5px 46px -16px $accent_color;
    border: 2px solid $accent_color;
    background-color: rgba($accent_color, 0.1);
    overflow: auto;
    .chat-message-item {
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      color: #000;
      overflow: auto;
      .message-item {
        display: inline-flex;
        margin: 0.5rem 1rem;
        .message-text {
          background-color: rgba($accent_color, 0.5);
          margin-top: 0;
          text-align: left;
          padding: 0.8rem;
        }
        .message-user {
          display: flex;
          text-align: left;
          padding: 0.5rem;
        }
        .message-date {
          font-weight: 200;
        }
      }
    }
    .message-is-typing {
      font-weight: 600;
      padding: 1rem;
      text-align: left;
    }
  }
  /*********SEND_MESSAGE*************/

  .send-form {
    width: 100%;
    @include flex;
    .send-box {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      width: 60%;
      margin: 1rem 1rem;
      padding: 1rem 0;
      .send-input {
        width: 100%;
      }
    }
    .btn-box {
      width: 40%;
      .send-button {
        width: 100%;
        padding: 1rem;
      }
    }
  }
}

/*******MEDIA_QUERY*************/

@include smallerPhone {
  .chat-box {
    width: 100%;
  }
}
// @include mostPhone {
//   .chat-box {
//   }
// }
@include smallerDesktop {
  .chat-box {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .users-box {
    width: 100%;
  }
}

@include mostTablets {
}
@media (min-width: 900px) {
  .users-box {
    display: block;
  }
  .chat-box {
    display: block;
  }
}
</style>
