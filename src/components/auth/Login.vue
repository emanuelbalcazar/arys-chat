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

    <!-- Dialog para verificacion de 2 pasos -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="400">
          <v-card>
            <v-card-title class="headline h3">Autenticacion de 2 fases requerida</v-card-title>
            <h4>Para verificar que sea usted realmente requerimos que ingrese el codigo autogenerado por la aplicacion Google Autenthicator en su celular. Gracccciela</h4>
            <v-text-field
                    label="Codigo de celular"
                    name="code"
                    prepend-icon="mdi-account"
                    type="number"
                    v-model="codeUser"
                    required
                  ></v-text-field>
                   <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">Cancelar</v-btn>
                <v-btn color="primary" @click="validate()">Validar codigo</v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>

    </v-main>
  </v-app>
</template>



<script>
import speakeasy from "speakeasy";
import * as firebase from 'firebase'
export default {
  props: {
    source: String,
  },
  data() {
    return {
      email: "",
      password: "",
      dialog: false,
      codeUser: ""
    };
  },
  created() {
    //this.$store.dispatch("setLoading", false);
  },
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
      return (this.password.length > 5) ? true : "Ingrese la contraseña";
    },
  },
  watch: {
    error(value) {
      if (value != null && value.message != null) this.$toasted.error(value.message);
    },
  },
  methods: {
    goTo(route) {
      this.$router.push({ name: route });
    },
    async signIn() {
      await this.$store.dispatch("signUserIn", {
        email: this.email,
        password: this.password,
      });

      if (this.error != null)
        return;
      this.dialog = true
      //this.goTo("Home")
    },
    async validate() {
      //Pedir secreto a la base de datos
      var user = this.$store.getters.user
      var secret = await firebase.database().ref('users').child(user.uid).once("value");
      console.log(secret.val().secret.ascii)
      var verified = speakeasy.totp.verify({
        secret: secret.val().secret.ascii, 
        encoding: "ascii",
        token: this.codeUser,
      });
      if (verified) {
        this.$toasted.success("Bienvenido al chat");
        this.$store.dispatch("userAuthenticated", true);
        this.$router.push({ name: "Home" });
      } else {
        this.$toasted.error("El codigo ingresado no es valido");
        //dialog = false
      }
    },
  },
};
</script>