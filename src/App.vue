<template>
  <v-app id="inspire">
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
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Acerca de</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="signOut()">
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Cerrar sesión</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-show="isAuthenticated()"></v-app-bar-nav-icon>
      <v-toolbar-title>{{title}}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container class fluid>
        <router-view />
      </v-container>
    </v-main>
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
  }),
  created() {
    this.$vuetify.theme.dark = false;
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    signOut() {
      this.$store.dispatch("signUserOut");
      this.$router.push({ name: "Login" });
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