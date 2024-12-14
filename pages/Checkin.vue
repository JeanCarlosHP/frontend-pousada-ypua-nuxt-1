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
            Check-ins
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="filteredReservas"
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
              <v-btn color="primary" @click="realizarCheckin(item)">Realizar Check-in</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
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
      checkins: [],
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
      filteredReservas: [],
    };
  },
  mounted() {
    this.fetchReservas();
    this.fetchHospedes();
  },
  methods: {
    async fetchReservas() {
      try {
        const response = await this.$axios.get("/reserva");
        this.filteredReservas = response.data.filter(reserva => reserva.status === 'RESERVADO');
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
    async realizarCheckin(item) {
      try {
        confirm(`Tem certeza de que deseja realizar o checkin da reserva ${item.codigo}?`) && 
          await this.$axios.post(`/checkin`, null, {
            params: {
              codigo: item.codigo
            },
          });
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
    }
  },
};
</script>
