<template>
  <v-app id="inspire">
    <v-main>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="7" sm="7" md="7">
            <v-card class>
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Autenticación de doble factor</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <div class="QRgenerator">
                  <h4>Esta aplicacion utiliza Autenticación de doble factor, para esto es necesario que le el siguiente codigo 
                    QR con la aplicación de Google Authenticator para obtener claves temporales que seran solicitadas cada vez que inicie sesion</h4>
                  <br />
                  <img alt height="230px" width="230px" align="center" :src="qrUrl" />
                  <v-text-field
                    label="Codigo de celular"
                    name="code"
                    prepend-icon="mdi-account"
                    type="number"
                    v-model="codeUser"
                    required
                  ></v-text-field>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="validate()">Validar codigo</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import * as firebase from 'firebase'

export default {
  name: "QRgenerator",
  components: {},
  created() {
    this.generateCode();
  },
  data() {
    return {
      secret: "",
      qrUrl: "",
      codeUser: "",
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    },
  },
  watch: {
    error(value) {
      if (value.message) this.$toasted.error(value.message);
    },
  },
  methods: {
    async generateCode() {
      this.secret = speakeasy.generateSecret({
        name: "Arys-Chat",
      });

      this.qrUrl = await qrcode.toDataURL(this.secret.otpauth_url);
    },
    async validate() {
      var verified = speakeasy.totp.verify({
        secret: this.secret.ascii,
        encoding: "ascii",
        token: this.codeUser,
      });
      var user = this.$store.getters.user
      console.log(this.$store.getters.user.uid)
      if (verified) {
        await firebase.database().ref('users').child(user.uid).update({ secret: this.secret});
        this.$toasted.success("Bienvenido al chat");
        this.$store.dispatch("userAuthenticated", true);
        this.$router.push({ name: "Home" });
      } else {
        this.$toasted.error("El codigo ingresado no es valido");
      }
    },
  },
};
</script>