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
            Acomodações
            <v-spacer />
            <v-btn v-if="isAuthenticated && isAdmin" color="primary" @click="dialog = true">
              Nova Acomodação
            </v-btn>
          </v-card-title>

          <v-carousel v-model="currentAcomodacao" cycle height="750">
            <v-carousel-item
              v-for="(acomodacao, index) in acomodacoes"
              :key="index"
              
            >
              <v-card class="fill-height">
                <v-img
                  :src="
                    acomodacao.fotos && acomodacao.fotos.length > 0
                      ? `data:${acomodacao.fotos[0].tipo};base64,${encodeBase64(
                          acomodacao.fotos[0].imagem.data
                        )}`
                      : 'https://fakeimg.pl/600x400'
                  "
                  height="400"
                  cover
                  @click="openModal(acomodacao)"
                ></v-img>
                <v-card-title class="text-h5">
                  {{ acomodacao.nome }}
                </v-card-title>

                <v-card-text>
                  <p>Descrição: {{ acomodacao.descricao }}</p>
                  <p>Capacidade: {{ acomodacao.capacidade }}</p>
                  <p>Preço: R$ {{ acomodacao.preco }}</p>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="primary" @click="openModal(acomodacao)">
                    Detalhes
                  </v-btn>
                  <v-btn v-if="isAuthenticated && isAdmin" color="primary" @click="editItem(acomodacao)">
                    Editar
                  </v-btn>
                  <v-btn v-if="isAuthenticated && isAdmin" color="error" @click="deleteItem(acomodacao)">
                    Excluir
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal para exibir detalhes da acomodação -->
    <v-dialog v-model="modalAcomodacao" max-width="800px">
      <v-card>
        <v-card-title class="text-h5">
          {{ selectedAcomodacao.nome }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <!-- Carrossel de imagens -->
              <v-carousel v-model="currentImage" cycle height="300">
                <v-carousel-item
                  v-for="(foto, fotoIndex) in selectedAcomodacao.fotos"
                  :key="fotoIndex"
                >
                  <v-img
                    :src="`data:${foto.tipo};base64,${encodeBase64(
                      foto.imagem.data
                    )}`"
                    height="300"
                    cover
                  ></v-img>
                </v-carousel-item>
              </v-carousel>
            </v-col>
            <v-col cols="12" md="6">
              <p>Descrição: {{ selectedAcomodacao.descricao }}</p>
              <p>Capacidade: {{ selectedAcomodacao.capacidade }}</p>
              <p>Preço: R$ {{ selectedAcomodacao.preco }}</p>

              <!-- Informações adicionais com ícones -->
              <div v-if="selectedAcomodacao.comAcessibilidade">
                <v-icon>mdi-wheelchair-accessibility</v-icon> Acessibilidade
              </div>
              <div v-if="selectedAcomodacao.comChuveiro">
                <v-icon>mdi-shower</v-icon> Chuveiro
              </div>
              <div v-if="selectedAcomodacao.comBanheira">
                <v-icon>mdi-bathtub</v-icon> Banheira
              </div>
              <div v-if="selectedAcomodacao.comToalhas">
                <v-icon>mdi-towels</v-icon> Toalhas
              </div>
              <div v-if="selectedAcomodacao.comSecador">
                <v-icon>mdi-hair-dryer</v-icon> Secador
              </div>
              <div v-if="selectedAcomodacao.comCozinha">
                <v-icon>mdi-silverware-fork-knife</v-icon> Cozinha
              </div>
              <div v-if="selectedAcomodacao.comRestaurante">
                <v-icon>mdi-food</v-icon> Restaurante
              </div>
              <div v-if="selectedAcomodacao.comArCondicionado">
                <v-icon>mdi-air-conditioner</v-icon> Ar Condicionado
              </div>
              <div v-if="selectedAcomodacao.comAquecedor">
                <v-icon>mdi-radiator</v-icon> Aquecedor
              </div>
              <div v-if="selectedAcomodacao.comTV">
                <v-icon>mdi-television</v-icon> TV ({{
                  selectedAcomodacao.tamanhoTV
                }}
                polegadas)
              </div>
              <div v-if="selectedAcomodacao.comWifi">
                <v-icon>mdi-wifi</v-icon> Wi-Fi
              </div>
              <div v-if="selectedAcomodacao.comFrigobar">
                <v-icon>mdi-fridge</v-icon> Frigobar
              </div>
              <div v-if="selectedAcomodacao.comCofre">
                <v-icon>mdi-safe</v-icon> Cofre
              </div>
              <div v-if="selectedAcomodacao.comVaranda">
                <v-icon>mdi-balcony</v-icon> Varanda
              </div>

              <!-- ... (Adicione mais detalhes da acomodação aqui, se necessário) ... -->
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="modalAcomodacao = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialog" max-width="700px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.nome"
                  label="Nome"
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

              <!-- <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editedItem.categoria"
                    label="Categoria"
                    required
                  ></v-text-field>
                </v-col> -->

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.capacidade"
                  label="Capacidade"
                  type="number"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.quantidadeCamas"
                  label="Quantidade de Camas"
                  type="number"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.tipoCama"
                  :items="tipoCamaOptions"
                  label="Tipo de Cama"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.tipoBanheiro"
                  :items="tipoBanheiroOptions"
                  label="Tipo de Banheiro"
                  required
                ></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comAcessibilidade"
                  label="Acessibilidade"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comChuveiro"
                  label="Chuveiro"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comBanheira"
                  label="Banheira"
                ></v-checkbox>
              </v-col>

              <!-- <v-col cols="12" sm="6">
                  <v-checkbox v-model="editedItem.comBide" label="Bidê">
                  </v-checkbox>
                </v-col> -->

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comToalhas"
                  label="Toalhas"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comSecador"
                  label="Secador"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comCozinha"
                  label="Cozinha"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comRestaurante"
                  label="Restaurante"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comArCondicionado"
                  label="Ar Condicionado"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comAquecedor"
                  label="Aquecedor"
                ></v-checkbox>
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox v-model="editedItem.comTV" label="TV"> </v-checkbox>
              </v-col>

              <v-col cols="12" sm="6" v-if="editedItem.comTV">
                <v-text-field
                  v-model="editedItem.tamanhoTV"
                  label="Tamanho da TV (polegadas)"
                  type="number"
                ></v-text-field>
              </v-col>

              <!-- <v-col cols="12" sm="6" v-if="editedItem.comTV">
                  <v-text-field
                    v-model="editedItem.canaisTV"
                    label="Canais de TV"
                  ></v-text-field>
                </v-col> -->

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comWifi"
                  label="Wi-Fi"
                ></v-checkbox>
              </v-col>

              <!-- <v-col cols="12" sm="6" v-if="editedItem.comWifi">
                  <v-text-field
                    v-model="editedItem.velocidadeWifi"
                    label="Velocidade do Wi-Fi"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" v-if="editedItem.comWifi">
                  <v-checkbox
                    v-model="editedItem.wifiPago"
                    label="Wi-Fi Pago"
                  ></v-checkbox>
                </v-col> -->

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comFrigobar"
                  label="Frigobar"
                ></v-checkbox>
              </v-col>

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comCofre"
                  label="Cofre"
                ></v-checkbox>
              </v-col>

              <!-- <v-col cols="12" sm="6">
                  <v-checkbox
                    v-model="editedItem.comTelefone"
                    label="Telefone"
                  ></v-checkbox>
                </v-col> -->

              <v-col cols="12" sm="6">
                <v-checkbox
                  v-model="editedItem.comVaranda"
                  label="Varanda"
                ></v-checkbox>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.descricao"
                  label="Descrição"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.preco"
                  label="Preço"
                  prefix="R$"
                  type="number"
                  required
                ></v-text-field>
              </v-col>

              <!-- Campo para Upload de Fotos -->
              <v-col cols="12">
                <v-file-input
                  v-model="fotos"
                  accept="image/*"
                  label="Fotos"
                  multiple
                ></v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="red darken-1" text @click="close"> Cancelar </v-btn>
          <v-btn color="green darken-1" text @click="save">Salvar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      modalAcomodacao: false, // Controla a visibilidade do modal
      selectedAcomodacao: {}, // Armazena a acomodação selecionada
      showAlert: false, // Controla a visibilidade do alerta
      errorMessage: "", // Armazena a mensagem de erro
      dialog: false,
      headers: [
        { text: "ID", value: "id" },
        { text: "Nome", value: "nome" },
        { text: "Número", value: "numero" },
        { text: "Capacidade", value: "capacidade" },
        { text: "Preço", value: "preco" },
        { text: "Ações", value: "acoes", sortable: false },
      ],
      tipoBanheiroOptions: ["Privativo", "Compartilhado"],
      tipoCamaOptions: [
        "Solteiro",
        "Solteiro King",
        "Beliche",
        "Casal",
        "Queen Size",
        "King Size",
        "Super King Size",
      ],
      acomodacoes: [],
      editedIndex: -1,
      editedItem: {
        nome: "",
        numero: 0,
        // categoria: '',
        capacidade: 0,
        quantidadeCamas: 0,
        tipoCama: "",
        tipoBanheiro: "",
        comChuveiro: false,
        comBanheira: false,
        comToalhas: false,
        comSecador: false,
        comAcessibilidade: false,
        comCozinha: false,
        comRestaurante: false,
        // comBide: false,
        comArCondicionado: false,
        comAquecedor: false,
        comTV: false,
        tamanhoTV: 0,
        // canaisTV: '',
        comWifi: false,
        // velocidadeWifi: '',
        // wifiPago: false,
        comFrigobar: false,
        comCofre: false,
        // comTelefone: false,
        comVaranda: false,
        descricao: "",
        preco: 0.0,
      },
      defaultItem: {
        // ... valores padrão para os campos
      },
      fotos: [], // Array para armazenar as fotos selecionadas
      currentAcomodacao: 0, // Índice da acomodação no carrossel
      currentImage: null,
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nova Acomodação" : "Editar Acomodação";
    },
    isAuthenticated() {
      return this.$store.state.auth.loggedIn;
    },
    isAdmin() {
      return this.$store.state.auth.user.role == "admin";
    },
  },
  mounted() {
    this.fetchAcomodacoes();
  },
  methods: {
    encodeBase64(buffer) {
      return new Buffer.from(buffer).toString('base64');
    },
    async fetchAcomodacoes() {
      try {
        const response = await this.$axios.get(`/acomodacao/`);
        this.acomodacoes = response.data;
      } catch (error) {
        this.errorMessage =error.response.data.message
        this.showAlert = true; // Ativa o alerta
        console.error(error);
      }
    },
    editItem(item) {
      this.editedIndex = this.acomodacoes.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
      this.modalAcomodacao = false;
    },
    deleteItem(item) {
      const index = this.acomodacoes.indexOf(item);
      confirm("Tem certeza que deseja excluir esta acomodação?") &&
        this.$axios
          .delete(`/acomodacao/${item.id}`)
          .then(() => {
            this.acomodacoes.splice(index, 1);
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
        this.fotos = []; // Limpa as fotos selecionadas
      });
    },
    async save() {
      // Cria um objeto FormData para enviar os dados
      const formData = new FormData();

      // Adiciona os dados da acomodação ao FormData
      for (const key in this.editedItem) {
        formData.append(key, this.editedItem[key]);
      }

      // Adiciona as fotos ao FormData
      for (let i = 0; i < this.fotos.length; i++) {
        formData.append("fotos", this.fotos[i]);
      }

      try {
        if (this.editedIndex > -1) {
          // Editar acomodação (incluindo fotos)
          const response = await this.$axios.put(
            `/acomodacao/${this.editedItem.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          // Atualiza a acomodação na lista
          Object.assign(this.acomodacoes[this.editedIndex], response.data);
        } else {
          // Criar nova acomodação (incluindo fotos)
          const response = await this.$axios.post(`/acomodacao/`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          // Adiciona a nova acomodação à lista
          this.acomodacoes.push(response.data.acomodacao);
          this.currentAcomodacao = this.acomodacoes.length - 1;
        }
        this.close();
      } catch (error) {
        this.errorMessage =error.response.data.message
        this.showAlert = true; // Ativa o alerta
        console.error(error);
      }
    },
    openModal(acomodacao) {
      this.selectedAcomodacao = acomodacao;
      this.modalAcomodacao = true;
    },
  },
};
</script>
