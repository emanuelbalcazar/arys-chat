<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="6" sm="6" md="6">
            <v-card class>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Correo electronico"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="email"
                    required
                    :rules="[hasEmail]"
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                    required
                    :rules="[hasPassword]"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="default" @click="goTo('Register')">Crear cuenta</v-btn>

                <v-spacer></v-spacer>
                <v-btn color="primary" @click="signIn()" :loading="loading">Entrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  props: {
    source: String,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  created() {},
  computed: {
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    },
    hasEmail() {
      return (this.email.length > 0) ? true : "Ingrese un correo electronico";
    },
    hasPassword() {
      return (this.password.length > 0) ? true : "Ingrese una contraseña";
    },
  },
  watch: {
    error(value) {
      if (value.message) this.$toasted.error(value.message);
    },
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
    },
    signIn() {
      this.$store.dispatch("signUserIn", {
        email: this.email,
        password: this.password,
      });

      if (!this.error.message) this.$router.push({ name: "QRgenerator" });
    },
  },
};
</script>