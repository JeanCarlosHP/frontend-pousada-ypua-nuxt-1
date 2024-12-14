<template>
  <v-container>
    <v-row>
      <v-alert
        v-model="showAlert"
        border="left"
        close-text="Close Alert"
        color="error"
        dark
        dismissible
        shaped
        width="100%"
        >{{ errorMessage }}
      </v-alert>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <span class="headline">Cadastro de Usuário</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="name"
                :rules="[v => !!v || 'Nome é obrigatório']"
                label="Nome"
                required
              ></v-text-field>
              <v-text-field
                v-model="email"
                :rules="[v => !!v || 'E-mail é obrigatório', v => /.+@.+\..+/.test(v) || 'E-mail deve ser válido']"
                label="E-mail"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                :rules="[v => !!v || 'Senha é obrigatória', v => v.length >= 6 || 'Senha deve ter pelo menos 8 caracteres']"
                label="Senha"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="cpf"
                :rules="[v => !!v || 'CPF é obrigatório']"
                label="CPF"
                required
              ></v-text-field>
              <v-text-field
                v-model="rg"
                :rules="[v => !!v || 'RG é obrigatório']"
                label="RG"
                required
              ></v-text-field>
              <v-text-field
                v-model="rua"
                :rules="[v => !!v || 'Rua é obrigatória']"
                label="Rua"
                required
              ></v-text-field>
              <v-text-field
                v-model="numero"
                :rules="[v => !!v || 'Número é obrigatório']"
                label="Número"
                required
              ></v-text-field>
              <v-text-field
                v-model="complemento"
                label="Complemento"
              ></v-text-field>
              <v-text-field
                v-model="bairro"
                :rules="[v => !!v || 'Bairro é obrigatório']"
                label="Bairro"
                required
              ></v-text-field>
              <v-text-field
                v-model="cidade"
                :rules="[v => !!v || 'Cidade é obrigatória']"
                label="Cidade"
                required
              ></v-text-field>
              <v-select
                v-model="estado"
                :items="estados"
                :rules="[v => !!v || 'Estado é obrigatório']"
                label="Estado"
                required
              ></v-select>
              <v-text-field
                v-model="pais"
                :rules="[v => !!v || 'País é obrigatório']"
                label="País"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="register" :disabled="!valid">Cadastrar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      name: '',
      email: '',
      password: '',
      cpf: '',
      rg: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: '',
      estados: [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 
        'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 
        'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 
        'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
      ],
      showAlert: false,
      errorMessage: "",
    };
  },
  methods: {
    async register() {
      if (this.$refs.form.validate()) {
        try {
          const response = await this.$axios.post('/usuario', {
            nome: this.name,
            email: this.email,
            senha: this.password,
            cpf: this.cpf,
            rg: this.rg,
            rua: this.rua,
            numero: this.numero,
            complemento: this.complemento,
            bairro: this.bairro,
            cidade: this.cidade,
            estado: this.estado,
            pais: this.pais,
            role: 'usuario'
          });

          this.$router.push('/login');
        } catch (error) {
          this.errorMessage =error.response.data.message
          this.showAlert = true; // Ativa o alerta
          console.error(error);
        }
      }
    }
  }
};
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>