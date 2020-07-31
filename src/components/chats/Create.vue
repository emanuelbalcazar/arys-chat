<template>
  <v-container fluid>
    <v-row xs="10" sm="10" md="10">
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
    </v-row>
  </v-container>
</template>

<script>
import * as firebase from "firebase";

export default {
  name: "CreateChatRoom",
  props: ['uid'],
  data() {
    return {
      chatName: "",
      loading: false,
    };
  },
  methods: {
    async createChat() {
      console.log('>>>>', this.uid)
      
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
      // guardo en el usuario que chat estuvo
      // updates["users/" + this.user.uid + "/chats/" + newPostKey] = {
      //   timestamp: time,
      // };

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
