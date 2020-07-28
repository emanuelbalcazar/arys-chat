<template>
  <v-app id="inspire">
    <!-- menu sidebar -->
    <v-navigation-drawer v-model="drawer" app clipped v-show="isAuthenticated()">
      <v-list dense>
        <v-list-item @click="goTo('Home')">
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Principal</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goTo('About')">
          <v-list-item-action>
            <v-icon>mdi-information</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Acerca de</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="dialog = true">
          <v-list-item-action>
            <v-icon>mdi-exit-to-app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- menu top bar -->
    <v-app-bar color="blue" app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-show="isAuthenticated()"></v-app-bar-nav-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-show="isAuthenticated()" class="pull-right">{{email || 'No user'}}</div>
    </v-app-bar>

    <v-main>
      <v-container class fluid>
        <router-view />
      </v-container>
    </v-main>


    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="400">
          <v-card>
            <v-card-title class="headline h3">¿Está seguro que desea salir?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialog = false">Cancelar</v-btn>
              <v-btn color="green darken-1" text @click="signOut">Salir</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  data: () => ({
    title: "ARyS Chat",
    drawer: false,
    dialog: false
  }),
  computed: {
    email() {
      return this.$store.getters.user
        ? this.$store.getters.user.email
        : "Sin usuario";
    },
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
    },
    isAuthenticated() {
      return this.$store.getters.user && this.$store.getters.isAuthenticated;
    },
    signOut() {
      this.dialog = false
      this.$store.dispatch("signUserOut");
      this.$router.push({ name: "Login" });
      this.drawer = false;
    },
  },
};
</script>

<style lang="scss">
body {
  height: 80%;
  #content {
    height: 80%;
  }
}
</style>