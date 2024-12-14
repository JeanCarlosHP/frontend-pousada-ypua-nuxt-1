<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <span class="headline">Perfil do Usuário</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <div v-if="!editMode">
                <p><strong>Nome:</strong> {{ user.nome }}</p>
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>RG:</strong> {{ user.rg }}</p>
                <p><strong>CPF:</strong> {{ user.cpf }}</p>
                <p><strong>Rua:</strong> {{ user.rua }}</p>
                <p><strong>Número:</strong> {{ user.numero }}</p>
                <p><strong>Complemento:</strong> {{ user.complemento }}</p>
                <p><strong>Bairro:</strong> {{ user.bairro }}</p>
                <p><strong>Cidade:</strong> {{ user.cidade }}</p>
                <p><strong>Estado:</strong> {{ user.estado }}</p>
                <p><strong>País:</strong> {{ user.pais }}</p>
              </div>
              <div v-else>
                <v-text-field
                  v-model="user.nome"
                  :rules="[v => !!v || 'Nome é obrigatório']"
                  label="Nome"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="user.rua"
                  :rules="[v => !!v || 'Rua é obrigatória']"
                  label="Rua"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="user.numero"
                  :rules="[v => !!v || 'Número é obrigatório']"
                  label="Número"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="user.complemento"
                  label="Complemento"
                ></v-text-field>
                <v-text-field
                  v-model="user.bairro"
                  :rules="[v => !!v || 'Bairro é obrigatório']"
                  label="Bairro"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="user.cidade"
                  :rules="[v => !!v || 'Cidade é obrigatória']"
                  label="Cidade"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="user.estado"
                  :rules="[v => !!v || 'Estado é obrigatório']"
                  label="Estado"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="user.pais"
                  :rules="[v => !!v || 'País é obrigatório']"
                  label="País"
                  required
                ></v-text-field>
              </div>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="toggleEditMode">{{ editMode ? 'Cancelar' : 'Editar' }}</v-btn>
            <v-btn v-if="editMode" color="success" @click="updateProfile" :disabled="!valid">Salvar</v-btn>
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
      editMode: false,
      user: {
        nome: '',
        email: '',
        rg: '',
        cpf: '',
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        pais: ''
      }
    };
  },
  mounted() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const response = await this.$axios.get('/usuario/me');
        this.user = response.data.user;
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      }
    },
    toggleEditMode() {
      this.editMode = !this.editMode;
    },
    async updateProfile() {
      if (this.$refs.form.validate()) {
        const updatedUser = {
          id: this.user.id,
          senha: this.user.senha,
          nome: this.user.name,
          email: this.user.email,
          rg: this.user.rg,
          cpf: this.user.cpf,
          rua: this.user.rua,
          numero: this.user.numero,
          complemento: this.user.complemento,
          bairro: this.user.bairro,
          cidade: this.user.cidade,
          estado: this.user.estado,
          pais: this.user.pais,
          role: this.user.role
        };

        try {
          const response = await this.$axios.put('/usuario/'+this.user.id, updatedUser, {
            headers: {
              'Content-Type': 'application/json'
            },
          });
          console.log('Perfil atualizado com sucesso:', response.data);
          this.editMode = false;
        } catch (error) {
          console.error('Erro ao atualizar perfil:', error);
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