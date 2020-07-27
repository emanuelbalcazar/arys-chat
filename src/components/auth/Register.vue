<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="5" sm="5" md="5">
            <v-card class>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Registrarse como usuario</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card-text>
                <v-form>
                  <v-text-field
                    label="Nombre de usuario"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="username"
                    required
                  ></v-text-field>

                  <v-text-field
                    label="Correo electronico"
                    name="email"
                    prepend-icon="mdi-account"
                    type="email"
                    v-model="email"
                    required
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Contraseña"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="password"
                    required
                  ></v-text-field>

                  <v-text-field
                    id="confirmPassword"
                    label="Confirmar contraseña"
                    name="confirmPassword"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="confirmPassword"
                    required
                    :rules="[comparePasswords]"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="default" @click="goTo('Login')">Volver</v-btn>

                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  :disabled="password != confirmPassword"
                  @click="register()"
                  :loading="loading"
                >Registrarme</v-btn>
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
      username: "",
      password: "",
      confirmPassword: "",
    };
  },
  computed: {
    comparePasswords() {
      return this.password !== this.confirmPassword
        ? "Las contraseñas no coinciden"
        : true;
    },
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    },
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push({ name: "Home" });
      }
    },
    error(value) {
      if (value.message)
        this.$toasted.error(value.message);
    },
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
    },
    register() {
      this.$store.dispatch("signUserUp", {
        username: this.username,
        email: this.email,
        password: this.password,
      });
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    },
  },
};
</script>