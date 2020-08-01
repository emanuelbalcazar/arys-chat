<template>
  <v-container fluid style="padding: 0;">
    <v-row no-gutters>
      <v-col sm="10" style="position: relative;">
        <v-banner single-line>
          <h3>{{chatName}}</h3>
          <template v-slot:actions>
            <v-btn text color="error" @click="leaveChat()">Abandonar chat</v-btn>
          </template>
        </v-banner>

        <div class="chat-container" ref="chatContainer">
          <message :messages="messages"></message>
        </div>
        <div class="typer">
          <input
            type="text"
            placeholder="Escriba un mensaje..."
            v-on:keyup.enter="sendMessage"
            v-model="content"
          />
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="sendMessage()" :loading="loading">Enviar</v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- modal -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="400">
          <v-card>
            <v-card-title class="headline h3">¿Desea abandonar el chat?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="green darken-1" text @click="leaveChat()">Salir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import Message from "./templates/Message.vue";
import * as firebase from "firebase";

export default {
  data() {
    return {
      content: "",
      chatMessages: [],
      currentRef: {},
      loading: false,
      totalChatHeight: 0,
      dialog: false,
      chatName: "",
    };
  },
  props: ["id"],
  mounted() {
    this.loadChat();
  },
  components: {
    message: Message,
  },
  computed: {
    messages() {
      return this.chatMessages;
    },
    email() {
      return this.$store.getters.user.email;
    },
    user() {
      return this.$store.getters.user;
    },
    onNewMessageAdded() {
      const that = this;

      let onNewMessageAdded = function (snapshot, newMessage = true) {
        let message = snapshot.val();
        message.key = snapshot.key;

        if (!newMessage) {
          that.chatMessages.unshift(that.processMessage(message));
          that.scrollTo();
        } else {
          that.chatMessages.push(that.processMessage(message));
          that.scrollToEnd();
        }
      };
      return onNewMessageAdded;
    },
  },
  watch: {
    "$route.params.id"(newId, oldId) {
      this.currentRef.off("child_added", this.onNewMessageAdded);
      this.loadChat();
    },
  },
  methods: {
    async loadChat() {
      this.totalChatHeight = this.$refs.chatContainer.scrollHeight;
      this.loading = false;

      if (this.$route.params.id !== undefined) {
        this.chatMessages = [];
        let chatID = this.$route.params.id;

        this.currentRef = firebase
          .database()
          .ref("messages")
          .child(chatID)
          .child("messages")
          .limitToLast(500);

        this.currentRef.on("child_added", this.onNewMessageAdded);

        let register = await firebase
          .database()
          .ref("chats")
          .child(this.$route.params.id)
          .once("value");
        this.chatName = register.val().name;
      }
    },
    processMessage(message) {
      return message;
    },
    sendMessage() {
      if (this.content !== "") {
        this.$store.dispatch("sendMessage", {
          email: this.email,
          content: this.content,
          date: new Date().toLocaleString(),
          chatID: this.$route.params.id,
        });

        this.content = "";
      }
    },
    scrollToEnd() {
      this.$nextTick(() => {
        var container = this.$el.querySelector(".chat-container");
        container.scrollTop = container.scrollHeight;
      });
    },
    scrollTo() {
      this.$nextTick(() => {
        let currentHeight = this.$refs.chatContainer.scrollHeight;
        let difference = currentHeight - this.totalChatHeight;
        var container = this.$el.querySelector(".chat-container");
        container.scrollTop = difference;
      });
    },
    async leaveChat() {
      await firebase
        .database()
        .ref(
          "/chat_members/" + this.$route.params.id + "/users/" + this.user.uid
        )
        .remove();

      this.$router.push({ name: "ChatList" });
    },
  },
};
</script>

<style>
.scrollable {
  overflow-y: auto;
  height: 90vh;
}
.typer {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  bottom: 0;
  height: 4.3rem;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -5px 10px -5px rgba(0, 0, 0, 0.2);
}
.typer input[type="text"] {
  position: absolute;
  left: 2.5rem;
  padding: 1rem;
  width: 80%;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 1.05rem;
}
.chat-container {
  box-sizing: border-box;
  height: calc(90vh - 9.5rem);
  overflow-y: auto;
  padding: 10px;
  background-color: #f2f2f2;
}
.message {
  margin-bottom: 3px;
}
.message.own {
  text-align: right;
}
.message.own .content {
  background-color: lightskyblue;
}
.chat-container .username {
  font-size: 16px;
  font-weight: inherit;
}
.chat-container .content {
  padding: 8px;
  background-color: lightgreen;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 2px 1px -1px rgba(0, 0, 0, 0.12);
  max-width: 50%;
  word-wrap: break-word;
}

.message-date {
  font-size: 14px;
  color: grey;
  text-align: right;
}

@media (max-width: 480px) {
  .chat-container .content {
    max-width: 60%;
  }
}
</style>
