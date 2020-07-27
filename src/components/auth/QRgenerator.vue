<template>
  <div class="QRgenerator">
    <h1>This will show a QR</h1>
    <img :src="qrUrl" />
    <v-text-field
      label="Codigo de celular"
      name="code"
      prepend-icon="mdi-account"
      type="number"
      v-model="codeUser"
      required
    ></v-text-field>
    <v-btn
      color="primary"
      @click="validate()"
    >Validar</v-btn>
  </div>
</template>

<script>
import speakeasy from "speakeasy";
import qrcode from "qrcode";
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
      codeUser: ""
    };
  },
  methods: {
    async generateCode() {
      this.secret = speakeasy.generateSecret({
        name: "WeAreDevs"
      });
      this.qrUrl = await qrcode.toDataURL(this.secret.otpauth_url);
    },
    validate(){
        console.log(this.secret)
        var verified = speakeasy.totp.verify({
            secret: this.secret.ascii, 
            encoding: 'ascii',
            token: this.codeUser
        })
        console.log(verified)
    }
  }
};
</script>