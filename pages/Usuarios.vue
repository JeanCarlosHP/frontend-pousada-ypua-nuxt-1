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
            Usuários
            <v-spacer />
            <v-btn color="primary" @click="dialog = true">Novo Usuário</v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="usuarios"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.acoes="{ item }">
              <v-icon small class="mr-2" @click="editItem(item)"
                >mdi-pencil</v-icon
              >
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
                <v-text-field
                  v-model="editedItem.nome"
                  label="Nome"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.email"
                  label="Email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.senha"
                  label="Senha"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  append-icon="mdi-eye"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.rg"
                  label="RG"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.cpf"
                  label="CPF"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.rua"
                  label="Rua"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.numero"
                  label="Número"
                  type="number"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.complemento"
                  label="Complemento"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.bairro"
                  label="Bairro"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.cidade"
                  label="Cidade"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.estado"
                  :items="estadosSiglas"
                  label="Estado"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.pais"
                  label="País"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.role"
                  :items="roles"
                  label="Papel"
                  required
                ></v-select>
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
      showPassword: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "Nome", value: "nome" },
        { text: "Email", value: "email" },
        { text: "RG", value: "rg" },
        { text: "CPF", value: "cpf" },
        { text: "Papel", value: "role" },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      usuarios: [],
      roles: ["admin", "usuario"], // Defina os papéis disponíveis
      estadosSiglas: [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RR",
        "RO",
        "RJ",
        "RN",
        "RS",
        "SC",
        "SP",
        "SE",
        "TO",
      ],
      editedIndex: -1,
      editedItem: {
        nome: "",
        email: "",
        senha: "",
        rg: "",
        cpf: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
        role: "",
      },
      defaultItem: {
        nome: "",
        email: "",
        senha: "",
        rg: "",
        cpf: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        pais: "",
        role: "",
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Usuário" : "Editar Usuário";
    },
  },
  mounted() {
    this.fetchUsuarios();
  },
  methods: {
    async fetchUsuarios() {
      try {
        const response = await this.$axios.get("/usuario");
        this.usuarios = response.data;
      } catch (error) {
        this.errorMessage =
          error.response.data.message || "Erro ao buscar usuários."; // Define a mensagem de erro
        this.showAlert = true; // Ativa o alerta
        console.error(error);
      }
    },
    editItem(item) {
      this.editedIndex = this.usuarios.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.usuarios.indexOf(item);
      confirm("Tem certeza de que deseja excluir este usuário?") &&
        this.$axios
          .delete(`/usuario/${item.id}`)
          .then(() => {
            this.usuarios.splice(index, 1);
          })
          .catch((error) => {
            this.errorMessage =
              error.response.data.message || "Erro ao excluir usuário.";
            this.showAlert = true;
            console.error(error);
          });
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.showPassword = false;
      });
    },
    save() {
      if (this.editedIndex > -1) {
        // Atualizar usuário existente
        this.$axios
          .put(`/usuario/${this.editedItem.id}`, this.editedItem)
          .then(() => {
            Object.assign(this.usuarios[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => {
            this.errorMessage =
              error.response.data.message || "Erro ao atualizar usuário.";
            this.showAlert = true;
            console.error(error);
          });
      } else {
        // Criar novo usuário
        this.$axios
          .post("/usuario", this.editedItem)
          .then((response) => {
            this.usuarios.push(response.data);
            this.fetchUsuarios();
            this.close();
          })
          .catch((error) => {
            this.errorMessage =
              error.response.data.message || "Erro ao criar usuário.";
            this.showAlert = true;
            console.error(error);
          });
      }
    },
  },
};
</script>
