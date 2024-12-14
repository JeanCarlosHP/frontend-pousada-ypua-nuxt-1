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
            Check-outs
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="reservas"
            :items-per-page="5"
            class="elevation-1"
          >
            <template v-slot:item.reserva="{ item }">
              {{ item.codigo }}
            </template>
            <template v-slot:item.hospedes="{ item }">
              <span v-for="hospede in item.hospedes" :key="hospede.id">
                {{ hospede.nome }}<br />
              </span>
            </template>
            <template v-slot:item.acoes="{ item }">
              <v-btn color="primary" @click="realizarCheckout(item)">Realizar Check-out</v-btn>
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
                  v-model="editedItem.reservaId"
                  :items="reservas"
                  item-text="codigo"
                  item-value="id"
                  label="Reserva"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.acomodacaoId"
                  :items="acomodacoes"
                  item-text="nome"
                  item-value="id"
                  label="Acomodação"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="editedItem.hospedeIds"
                  :items="hospedes"
                  item-text="nome"
                  item-value="id"
                  label="Hóspedes"
                  multiple
                  chips
                ></v-autocomplete>
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
  middleware: "auth",
  data() {
    return {
      showAlert: false,
      errorMessage: "",
      dialog: false,
      headers: [
        { text: "ID", value: "id", width: "auto" },
        { text: "Reserva", value: "reserva", width: "auto" },
        { text: "Hóspedes", value: "hospedes", width: "auto" },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      checkouts: [],
      reservas: [],
      acomodacoes: [],
      hospedes: [],
      editedIndex: -1,
      editedItem: {
        reservaId: null,
        acomodacaoId: null,
        hospedeIds: [],
      },
      defaultItem: {
        reservaId: null,
        acomodacaoId: null,
        hospedeIds: [],
      },
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Novo Check-out" : "Editar Check-out";
    },
  },
  mounted() {
    this.fetchReservas();
    this.fetchAcomodacoes();
    this.fetchHospedes();
  },
  methods: {
    async fetchReservas() {
      try {
        const response = await this.$axios.get("/reserva");
        this.reservas = response.data.filter(
          (reserva) => reserva.status === "EM PROCESSAMENTO"
        );
      } catch (error) {
        this.errorMessage = error.response.data.message;
        this.showAlert = true;
        console.error(error);
      }
    },
    async fetchAcomodacoes() {
      try {
        const response = await this.$axios.get("/acomodacao");
        this.acomodacoes = response.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
        this.showAlert = true;
        console.error(error);
      }
    },
    async fetchHospedes() {
      try {
        const response = await this.$axios.get("/hospede");
        this.hospedes = response.data;
      } catch (error) {
        this.errorMessage = error.response.data.message;
        this.showAlert = true;
        console.error(error);
      }
    },
    async realizarCheckout(item) {
      try {
        confirm(
          `Tem certeza de que deseja realizar o checkout da reserva ${item.codigo}?`
        ) &&
          (await this.$axios.post(`/checkout`, null, {
            params: {
              codigo: item.codigo,
            },
          }));
        this.fetchReservas();
      } catch (error) {
        this.showAlert = true;
        this.errorMessage = error.response.data.message;
      }
    },
    close() {
      this.dialog = false;
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    save() {},
  },
};
</script>
