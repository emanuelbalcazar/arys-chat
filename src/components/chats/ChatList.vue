<template>
  <v-container ref="chatlistContainer">
    <v-btn color="primary" @click="dialog = true">Crear una sala</v-btn>
    <br />
    <br />
    <v-row no-gutters>
      <v-col v-if="chats.length == 0">No hay salas de chats creadas</v-col>
      <!-- chat lists -->
      <v-col v-for="chat in chats" :key="chat.name" cols="12" sm="4">
        <v-card class="mx-auto" max-width="344" outlined>
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">{{chat.key}}</div>
              <v-list-item-title class="headline mb-1">{{chat.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-card-actions>
            <v-btn text @click="joinChat(chat)" v-if="!chat.isAlreadyJoined">Unirse al chat</v-btn>
            <v-btn v-if="chat.isAlreadyJoined" @click="enterChat(chat)">Entrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- create chat room -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="500">
          <v-card>
            <v-card-title class="headline h3">Crear una nueva sala de chat</v-card-title>
            <v-card-text>
              <v-row xs="10" sm="10" md="10">
                <form @submit.prevent="createChat">
                  <v-text-field
                    name="chatname"
                    label="Nombre de la sala"
                    id="chatname"
                    v-model="chatName"
                    type="text"
                    required
                    :rules="[hasName]"
                  ></v-text-field>
                </form>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="primary" :loading="loading" @click="createChatRoom()">Crear</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import * as firebase from "firebase";

export default {
  components: {},
  data() {
    return {
      loadedChats: [],
      loading: false,
      dialog: false,
      chatName: "",
    };
  },
  mounted() {
    this.loadRecentChats();
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    chats() {
      return this.loadedChats;
    },
    hasName() {
      return this.chatName.length > 2 ? true : "Ingrese un nombre para el chat";
    },
  },
  watch: {
    loadedChats: {
      deep: true,
      handler() {},
    },
  },
  methods: {
    async loadRecentChats(lastKey) {
      let that = this;

      let snapshot = await firebase
        .database()
        .ref("chats")
        .orderByKey()
        .limitToLast(30)
        .once("value");

      that = this;

      snapshot.forEach(async function (childSnapshot) {
        let chat = childSnapshot.val();
        chat.key = childSnapshot.key;
        chat.isAlreadyJoined = await that.isAlreadyJoined(
          that.user.uid,
          chat.key
        );
        that.loadedChats.unshift(chat);
      });
    },
    async isAlreadyJoined(uid, key) {
      let aux = await firebase
        .database()
        .ref("/chat_members/" + key + "/users/")
        .child(uid)
        .once("value");
      return aux.exists() ? aux.exists() : false;
    },
    async enterChat(chat) {
      this.$router.push("/chats/" + chat.key);
    },
    async joinChat(chat) {
      let updates = {};

      updates["/chat_members/" + chat.key + "/users/" + this.user.uid] = {
        connected: true,
        timestamp: new Date().toLocaleString(),
      };
      
      await firebase.database().ref().update(updates);
      this.loading = false;
      this.$router.push("/chat/" + chat.key);
    },
    async createChatRoom() {
      if (this.chatName == "" && this.loading) return;

      this.loading = true;

      // inserto el chat a la coleccion de chats en la db
      let chatKey = await firebase.database().ref().child("chats").push().key;

      let updates = {};
      // creo el nuevo chat con su key y nombre
      updates["/chats/" + chatKey] = { name: this.chatName };
      // agrego como miembro del chat al usuario
      updates["/chat_members/" + chatKey + "/users/" + this.user.uid] = {
        connected: true,
        timestamp: new Date().toLocaleString()
      };

      // envio a actualizar los valores
      await firebase.database().ref().update(updates);
      this.loading = false;
      this.$router.push("/chat/" + chatKey);
    },
  },
};
</script>