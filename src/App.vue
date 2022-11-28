<template>
  <div class="container">
    <!--<h1 class="page-headline">Chat</h1>
    <div class="switch-box" v-if="isReady">
      <ul class="switch-list">
        <li
          class="list-item"
          :class="{ selected: selected === 0 }"
          @click="changeSelected(0), (isPreview = false)"
        >
          Login
        </li>
        <li
          class="list-item"
          :class="{ selected: selected === 1 }"
          @click="changeSelected(1), (isPreview = true)"
        >
          chat
        </li>
      </ul>
    </div>-->

    <JoinUserComponent
      v-if="!isReady"
      v-model:username="username"
      @submit="joinToChat"
      :errorLoginMsg="errorLoginMsg"
    />

    <div class="wrapper" v-if="isReady">
      <UserListComponent
        :users="users"
        :roomId="roomId"
        :rooms="rooms"
        :isPreview="isPreview"
        v-model:roomId="roomId"
      />

      <ChatBoxComponent
        :isPreview="isPreview"
        :messages="messages"
        :isTyping="isTyping"
        :userId="userId"
        :errorSendMsg="errorSendMsg"
        v-model:message="message"
        @submit="sendMessage"
      />
      <createRoomComponent
        :isPreview="isPreview"
        :messages="messages"
        :isTyping="isTyping"
        :userId="userId"
        :errorSendMsg="errorSendMsg"
        v-model:roomName="roomName"
        @submit="createRoom"
      />
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import { ref, watch } from "vue";

import JoinUserComponent from "@/components/LoginBox";
import UserListComponent from "@/components/UserList";
import ChatBoxComponent from "@/components/ChatBox";
import createRoomComponent from "@/components/createRoom.vue";

export default {
  name: "App",
  components: {
    JoinUserComponent,
    UserListComponent,
    ChatBoxComponent,
    createRoomComponent,
  },
  setup() {
    const socket = io("http://107.178.57.138:3000");
    let users = ref([]);
    const rooms = ref([]);
    const messages = ref([]);
    const message = ref("");
    const roomId = ref("");
    const roomName = ref("");
    const username = ref("");
    const selected = ref(0);

    let isReady = ref(false);
    let isPreview = ref(false);
    let isTyping = ref(false);
    let userId = ref("");

    const changeSelected = (i) => {
      selected.value = i;
    };

    /*********VALIDATE************* */

    let errorLoginMsg = ref("");
    let errorSendMsg = ref("");

    //***************Socket function*******************

    socket.on("initChat", (data) => {
      messages.value = data.messages;
    });

    socket.on("userConnected", (username) => {
      console.log(`${username} has joined`);
    });

    socket.on("userDisconnected", (username) => {
      console.log(`${username} has leaved`);
    });

    socket.on("getUsers", (data) => {
      users.value = data.filter((user) => {
        console.log(
          "the user room is ",
          user.room,
          "and the value is",
          roomId.value
        );
        if (!roomId.value || user.room == roomId.value) {
          console.log("entre aqui");
          return user;
        }
      });
    });
    socket.on("getRooms", (data) => {
      rooms.value = data;
    });

    socket.on("newMessage", (data) => {
      messages.value.push(data);
    });
    socket.on("newRoom", (data) => {
      rooms.value.push(data);
    });
    socket.on("refreshChat", (data) => {
      messages.value = data;
    });

    // *********User Typing********

    socket.on("isTyping", (data) => {
      isTyping.value = data;
    });
    socket.on("stopTyping", () => {
      isTyping.value = false;
    });

    watch(message, (m) => {
      m ? socket.emit("isTyping", username.value) : socket.emit("stopTyping");
    });

    watch(roomId, (m) => {
      m ? socket.emit("newRoomId", roomId) : "";
    });

    //*****Join User to Chat************

    const joinToChat = () => {
      if (/^(([a-zA-Z0-9]{3,}))+$/.test(username.value) == false) {
        errorLoginMsg.value = "user name should have at least 3 characters";
      } else {
        socket.emit("enterUsername", { username: username.value });
        username.value = "";
        isReady.value = true;
        userId.value = socket.id;
      }
    };

    /*********Send New Message******** */

    const sendMessage = () => {
      if (message.value == "") {
        errorSendMsg.value = "Please write something";
      }
      if (roomId.value == "") {
        errorSendMsg.value = "Please choose a room";
      } else {
        console.log("the room id is ", roomId.value);
        socket.emit("newMessage", {
          room: roomId,
          username: username.value,
          message: message.value,
        });
        message.value = "";
      }
    };

    const createRoom = () => {
      if (roomName.value == "") {
        errorSendMsg.value = "Please write something";
      } else {
        console.log("the room id is ", roomId);
        socket.emit("newRoom", {
          roomName: roomName.value,
        });
        roomName.value = "";
      }
    };

    return {
      socket,
      username,
      message,
      roomName,
      users,
      rooms,
      roomId,
      messages,
      joinToChat,
      sendMessage,
      createRoom,
      userId,
      isReady,
      isTyping,
      isPreview,
      selected,
      changeSelected,
      errorLoginMsg,
      errorSendMsg,
    };
  },
};
</script>

<style lang="scss">
@use "./scss/index.scss" as *;

.wrapper {
  @include flex;
  margin-top: 2%;
  width: 100%;
  height: 30rem;
}
/*******MEDIA_QUERY*************/

@include smallerPhone {
  .container {
    font-size: $font_size_to_340;
    .wrapper {
      width: 100%;
    }
  }
}
@include mostPhone {
  .container {
    font-size: $font_size_to_340;
    .wrapper {
      width: 100%;
    }
  }
}
@include mostTablets {
  .container {
    font-size: $font_size_to_576;
    .wrapper {
      width: 100%;
    }
  }
}
@include smallerDesktop {
  .container {
    font-size: $font_size_to_1200;
    .wrapper {
      width: 100%;
    }
  }
}
</style>
