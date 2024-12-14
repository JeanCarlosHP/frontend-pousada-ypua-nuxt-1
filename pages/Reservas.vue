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
            Reservas
            <v-spacer />
            <v-btn color="primary" @click="dialog = true">Nova Reserva</v-btn>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="reservas"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.usuario="{ item }">
              {{ item.usuario.nome }}
            </template>
            <template v-slot:item.hospedes="{ item }">
              <span v-for="hospede in item.hospedes" :key="hospede.id">
                {{ hospede.nome }}<br />
              </span>
            </template>
            <template v-slot:item.acomodacao="{ item }">
              {{ item.acomodacao.nome }} (Número: {{ item.acomodacao.numero }})
            </template>
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
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.usuarioId"
                  :items="usuarios"
                  item-text="nome"
                  item-value="id"
                  label="Usuário"
                  required
                ></v-select>
              </v-col>
              <!-- <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.acomodacaoId"
                  :items="acomodacoes"
                  item-text="nome"
                  item-value="id"
                  label="Acomodação"
                  required
                ></v-select>
              </v-col> -->
              <v-col cols="12" sm="6">
                <v-menu
                  ref="menuDataEntrada"
                  v-model="menuDataEntrada"
                  :close-on-content-click="false"
                  :return-value.sync="editedItem.dataEntrada"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.dataEntrada"
                      label="Data de Entrada"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.dataEntrada"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="menuDataEntrada = false"
                    >
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="
                        $refs.menuDataEntrada.save(editedItem.dataEntrada)
                      "
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="menuDataSaida"
                  v-model="menuDataSaida"
                  :close-on-content-click="false"
                  :return-value.sync="editedItem.dataSaida"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="editedItem.dataSaida"
                      label="Data de Saída"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="editedItem.dataSaida"
                    no-title
                    scrollable
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="menuDataSaida = false">
                      Cancelar
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.menuDataSaida.save(editedItem.dataSaida)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.status"
                  :items="statusOptions"
                  label="Status"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.valorTotal"
                  label="Valor Total"
                  type="number"
                  prefix="R$"
                  required
                ></v-text-field>
              </v-col>
              <!-- <v-col cols="12">
                <v-autocomplete
                  v-model="editedItem.hospedeIds"
                  :items="hospedes"
                  item-text="nome"
                  item-value="id"
                  label="Hóspedes"
                  multiple
                  chips
                ></v-autocomplete>
              </v-col> -->
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
      menuDataEntrada: false,
      menuDataSaida: false,
      headers: [
        { text: "ID", value: "id", width: "auto" },
        { text: "Código", value: "codigo", width: "auto" },
        { text: "Usuário", value: "usuario", width: "auto" },
        { text: "Acomodação", value: "acomodacao", width: "auto" },
        { text: "Hóspedes", value: "hospedes", width: "auto" },
        { text: "Data Entrada", value: "dataEntrada", width: "auto" },
        { text: "Data Saída", value: "dataSaida", width: "auto" },
        { text: "Status", value: "status", width: "auto" },
        { text: "Valor Total", value: "valorTotal", width: "auto" },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      reservas: [],
      usuarios: [],
      acomodacoes: [],
      hospedes: [],
      statusOptions: [
        "EM PROCESSAMENTO",
        "RESERVADO",
        "CANCELADO",
        "CONCLUIDO",
      ],
      editedIndex: -1,
      editedItem: {
        usuarioId: null,
        dataEntrada: new Date().toISOString().substr(0, 10),
        dataSaida: new Date().toISOString().substr(0, 10),
        status: "EM PROCESSAMENTO",
        valorTotal: 0,
      },
      defaultItem: {
        usuarioId: null,
        acomodacaoId: null,
        hospedeIds: [],
        dataEntrada: new Date().toISOString().substr(0, 10),
        dataSaida: new Date().toISOString().substr(0, 10),
        status: "EM PROCESSAMENTO",
        valorTotal: 0,
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nova Reserva" : "Editar Reserva";
    },
  },
  mounted() {
    this.fetchReservas();
    this.fetchUsuarios();
    this.fetchAcomodacoes();
    this.fetchHospedes();
  },
  created() {
    this.atualizarValorTotal(); // Define o valor total inicial
  },
  watch: {
    "editedItem.dataEntrada": {
      handler(novoValor) {
        this.atualizarValorTotal();
      },
    },
    "editedItem.dataSaida": {
      handler(novoValor) {
        this.atualizarValorTotal();
      },
    },
  },
  methods: {
    calcularValorTotal(dataEntrada, dataSaida, precoAcomodacao) {
      const dataEntradaObj = new Date(dataEntrada);
      const dataSaidaObj = new Date(dataSaida);
      const diffEmMilissegundos = dataSaidaObj - dataEntradaObj;
      const diffEmDias = Math.ceil(diffEmMilissegundos / (1000 * 60 * 60 * 24)); // Arredonda para cima
      return diffEmDias * precoAcomodacao;
    },
    atualizarValorTotal() {
      if (this.editedItem.acomodacaoId) {
        const acomodacaoSelecionada = this.acomodacoes.find(
          (acomodacao) => acomodacao.id === this.editedItem.acomodacaoId
        );

        if (acomodacaoSelecionada) {
          this.editedItem.valorTotal = this.calcularValorTotal(
            this.editedItem.dataEntrada,
            this.editedItem.dataSaida,
            acomodacaoSelecionada.preco
          );
        } else {
          // Tratar o caso em que a acomodação não é encontrada
          this.errorMessage = "Acomodação não encontrada.";
          this.showAlert = true;
        }
      } else {
        // Define o valor total como 0 se a acomodação ainda não foi selecionada
        this.editedItem.valorTotal = 0;
      }
    },
    async fetchReservas() {
      try {
        const response = await this.$axios.get("/reserva");
        this.reservas = response.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
        this.showAlert = true; // Ativa o alerta
        console.error(error);
      }
    },
    async fetchUsuarios() {
      try {
        const response = await this.$axios.get("/usuario");
        this.usuarios = response.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
        this.showAlert = true; // Ativa o alerta
        console.error(error);
      }
    },
    async fetchAcomodacoes() {
      try {
        const response = await this.$axios.get("/acomodacao");
        this.acomodacoes = response.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
        this.showAlert = true; // Ativa o alerta
        console.error(error);
      }
    },
    async fetchHospedes() {
      try {
        const response = await this.$axios.get("/hospede");
        this.hospedes = response.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
        this.showAlert = true; // Ativa o alerta
        console.error(error);
      }
    },
    editItem(item) {
      this.editedIndex = this.reservas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.reservas.indexOf(item);
      confirm("Tem certeza de que deseja excluir esta reserva?") &&
        this.$axios
          .delete(`/reserva/${item.id}`)
          .then(() => {
            this.reservas.splice(index, 1);
          })
          .catch((error) => {
            this.errorMessage = error.response.data.message;
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
        // Remover campos indesejados
        const itemToSave = { ...this.editedItem };
        delete itemToSave.id;
        delete itemToSave.createdAt;
        delete itemToSave.updatedAt;
        delete itemToSave.deletedAt;
        delete itemToSave.usuario;
        delete itemToSave.acomodacao;
        delete itemToSave.hospedes;
        delete itemToSave.acomodacaoId;
        delete itemToSave.hospedeIds;

        // Atualizar reserva existente
        console.log(itemToSave)
        this.$axios
          .put(`/reserva/${this.editedItem.id}`, itemToSave)
          .then(() => {
            Object.assign(this.reservas[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => {
            this.errorMessage = error.response.data.message;
            this.showAlert = true; // Ativa o alerta
            console.error(error);
          });
      } else {
        // Criar nova reserva
        this.$axios
          .post("/reserva", {
            // Envie os dados necessários para a API, incluindo usuarioId, acomodacaoId, hospedeIds, etc.
            ...this.editedItem,
            valorTotal: this.editedItem.valorTotal.toString(), // Converte valorTotal para string
          })
          .then((response) => {
            this.reservas.push(response.data);
            this.fetchReservas();
            this.close();
          })
          .catch((error) => {
            this.errorMessage = error.response.data.message;
            this.showAlert = true; // Ativa o alerta
            console.error(error);
          });
      }
    },
  },
};
</script>
