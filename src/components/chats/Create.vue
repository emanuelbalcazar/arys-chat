<template>
  <v-container fluid>
    <form @submit.prevent="createChat">
      <v-text-field
        name="chatname"
        label="Nombre de la sala"
        id="chatname"
        v-model="chatName"
        type="text"
        required
      ></v-text-field>
    </form>
  </v-container>
</template>

<script>
import * as firebase from "firebase";

export default {
  name: "CreateChatRoom",
  props: ["uid"],
  data() {
    return {
      chatName: "",
      loading: false,
    };
  },
  methods: {
    async createChat() {
      if (this.chatName == "" || this.loading) return;

      this.loading = true;
      let time = new Date().valueOf();

      // inserto el chat a la coleccion de chats en la db
      let newPostKey = await firebase.database().ref().child("chats").push()
        .key;

      let updates = {};
      // creo el nuevo chat con su key y nombre
      updates["/chats/" + newPostKey] = { name: this.chatName };
      // agrego como miembro del chat al usuario
      updates["/chat_members/" + newPostKey + "/users/" + this.user.uid] = {
        timestamp: time,
      };

      firebase
        .database()
        .ref()
        .update(updates)
        .then(() => {
          this.loading = false;
          this.$router.push("/chat/" + newPostKey);
        });
    },
  },
};
</script>
