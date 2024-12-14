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
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Hóspedes
            <v-spacer />
            <v-btn color="primary" @click="dialog = true">Novo Hóspede</v-btn>
          </v-card-title>
          <v-data-table :headers="headers" :items="hospedes" :items-per-page="5" class="elevation-1">
            <template v-slot:item.acoes="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.nome" label="Nome Completo" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.email" label="Email" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.rg" label="RG" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.cpf" label="CPF" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.rua" label="Rua" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.numero" label="Número" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.complemento" label="Complemento"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.bairro" label="Bairro" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.cidade" label="Cidade" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select v-model="editedItem.estado" :items="estadosSiglas" label="Estado" required></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="editedItem.pais" label="País" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red darken-1" text @click="close">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      showAlert: false, // Controla a visibilidade do alerta
      errorMessage: "", // Armazena a mensagem de erro
      dialog: false,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nome', value: 'nome' },
        { text: 'Email', value: 'email' },
        { text: 'RG', value: 'rg' },
        { text: 'CPF', value: 'cpf' },
        { text: 'Ações', value: 'acoes', sortable: false },
      ],
      hospedes: [],
      editedIndex: -1,
      estadosSiglas : ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RR', 'RO', 'RJ', 'RN', 'RS', 'SC', 'SP', 'SE', 'TO'],
      editedItem: {
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
        pais: '',
      },
      defaultItem: {
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
        pais: '',
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Novo Hóspede' : 'Editar Hóspede';
    },
  },
  mounted() {
    this.fetchHospedes();
  },
  methods: {
    async fetchHospedes() {
      try {
        const response = await this.$axios.get('/hospede/');
        this.hospedes = response.data;
      } catch (error) {
        this.errorMessage =error.response.data.message
        this.showAlert = true; // Ativa o alerta
        console.error(error);
      }
    },
    editItem(item) {
      this.editedIndex = this.hospedes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.hospedes.indexOf(item);
      confirm('Tem certeza que deseja excluir este hóspede?') &&
        this.$axios
          .delete(`/hospede/${item.id}`) // Substitua pelo endpoint da sua API
          .then(() => {
            this.hospedes.splice(index, 1);
          })
          .catch((error) => {
            this.errorMessage =error.response.data.message
            this.showAlert = true; // Ativa o alerta
            console.error(error);
          });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        const itemToSave = { ...this.editedItem };
        delete itemToSave.createdAt;
        delete itemToSave.updatedAt;
        delete itemToSave.deletedAt;

        this.$axios
          .put(`/hospede/${this.editedItem.id}`, itemToSave) // Substitua pelo endpoint da sua API
          .then(() => {
            Object.assign(this.hospedes[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => {
            this.errorMessage =error.response.data.message
            this.showAlert = true; // Ativa o alerta
            console.error(error);
          });
      } else {
        this.$axios
          .post(`/hospede/`, this.editedItem) // Substitua pelo endpoint da sua API
          .then((response) => {
            this.hospedes.push(response.data);
            this.fetchHospedes();
            this.close();
          })
          .catch((error) => {
            this.errorMessage =error.response.data.message
            this.showAlert = true; // Ativa o alerta
            console.error(error);
          });
      }
    },
  },
};
</script>