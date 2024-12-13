## Pousada Ypuã - Sistema de Gerenciamento

Este repositório contém o código fonte do sistema de gerenciamento da Pousada Ypuã, construído com Nuxt.js, Vue.js e Vuetify.

### Visão Geral

O sistema oferece funcionalidades completas para gerenciar diversos aspectos da pousada, incluindo:

- **Usuários:** Cadastro, edição, exclusão e controle de permissões.
- **Hóspedes:** Cadastro, edição, exclusão e histórico de reservas.
- **Acomodações:** Cadastro, edição, exclusão, gerenciamento de fotos e informações detalhadas (capacidade, tipo de cama, comodidades, etc.).
- **Reservas:** Cadastro, edição, exclusão, controle de status (em processamento, reservado, cancelado, concluído), gerenciamento de hóspedes e informações financeiras (valor total).
- **Relatórios:** Visualização da receita total mensal e um gráfico de sparkline.

### Funcionamento

[<img src="./assets/homescreen.png" width="100%">](https://youtu.be/9bka-xIPfII "Funcionamento")


### Pré-requisitos

- Node.js e npm (ou yarn) instalados.

### Instalação

1. Clone o repositório: `git clone <repositório>`
2. Acesse a pasta do projeto: `cd <pasta-do-projeto>`
3. Instale as dependências: `npm install`

### Configuração

1. **Arquivo `.env`:**
    - Crie um arquivo `.env` na raiz do projeto.
    - Defina a variável de ambiente `API_ENDPOINT` com o endereço da sua API.
      - Exemplo: API_ENDPOINT=http://localhost:3000
    - Defina a variável de ambiente `PORT` com a porta que a aplicação deve rodar.
      - Exemplo: PORT=8080
2. **Configuração da API:**
    - Certifique-se de que a API esteja configurada para lidar com as requisições do sistema.

### Rodar o projeto

1. Inicie o servidor de desenvolvimento: `npm run dev` (ou `yarn dev`)
2. Acesse o sistema em `http://localhost:3000`

### Documentação

### Componentes

- **Navbar.vue:**
    - Barra de navegação principal com menu responsivo e ícone de menu lateral.
    - Permite a navegação entre as diferentes páginas do sistema.
- **Footer.vue:**
    - Rodapé com informações da pousada, links para redes sociais e informações de contato.
    - Configurações para a posição do rodapé (fixo, absoluto ou padrão).
- **Default.vue:**
    - Página principal do sistema.
    - Apresenta uma mensagem de boas-vindas.
- **Acomodações.vue:**
    - Lista as acomodações disponíveis, com informações básicas e botões para edição e exclusão.
    - Permite adicionar novas acomodações através de um modal com campos detalhados para cada atributo.
    - Inclui o upload de imagens para as acomodações.
- **AcomodaçõesCarrousel.vue:**
    - Apresenta as acomodações em um carrossel, com informações básicas e imagens.
    - Permite editar e excluir acomodações através de botões na parte inferior de cada card.
    - Inclui a funcionalidade de upload de fotos para as acomodações.
- **Hospedes.vue:**
    - Lista os hóspedes cadastrados, com informações básicas e botões para edição e exclusão.
    - Permite adicionar novos hóspedes através de um modal com campos para informações pessoais e de contato.
- **Relatorios.vue:**
    - Exibe um relatório com a receita total mensal.
    - Inclui um gráfico de sparkline para visualizar a receita mensal ao longo do ano.
- **Reservas.vue:**
    - Lista as reservas existentes, com informações sobre usuário, acomodação, hóspedes, data de entrada e saída, status e valor total.
    - Permite adicionar novas reservas através de um modal com campos para informações sobre a reserva.
    - Permite editar e excluir reservas.
- **Usuarios.vue:**
    - Lista os usuários cadastrados, com informações básicas e botões para edição e exclusão.
    - Permite adicionar novos usuários através de um modal com campos para informações pessoais, de contato e controle de permissões (papéis).

### Funcionalidades

- **Gerenciamento de usuários:**
    - Permite o cadastro, edição e exclusão de usuários.
    - Inclui a definição de papéis (admin, usuário) para controlar as permissões de acesso.
- **Gerenciamento de hóspedes:**
    - Permite o cadastro, edição e exclusão de hóspedes.
    - Armazena informações pessoais e de contato.
- **Gerenciamento de acomodações:**
    - Permite o cadastro, edição e exclusão de acomodações.
    - Inclui a possibilidade de adicionar fotos para cada acomodação.
    - Permite configurar detalhes sobre as acomodações, como capacidade, tipo de cama, comodidades, etc.
- **Gerenciamento de reservas:**
    - Permite o cadastro, edição e exclusão de reservas.
    - Inclui a possibilidade de associar usuários, acomodações e hóspedes às reservas.
    - Permite definir o status da reserva (em processamento, reservado, cancelado, concluído).
    - Permite gerenciar informações financeiras, como o valor total da reserva.
- **Relatórios:**
    - Exibe um relatório com a receita total mensal.
    - Inclui um gráfico de sparkline para visualizar a receita mensal ao longo do ano.

### Tecnologias Utilizadas

- **Nuxt.js:** Framework JavaScript para a criação de aplicações web Vue.js.
- **Vue.js:** Framework JavaScript para a criação de interfaces de usuário interativas.
- **Vuetify:** Framework de componentes UI para Vue.js.
- **Axios:** Biblioteca para realizar requisições HTTP.

### Contribuições

Contribuições são bem-vindas! Para contribuir, siga estes passos:

1. **Faça um fork do repositório.**
2. **Crie um novo branch:** `git checkout -b feature/<nome-do-recurso>`
3. **Faça suas alterações e commit:** `git commit -m "Correção: <descrição da correção>"`
4. **Envie suas alterações para o branch principal:** `git push origin feature/<nome-do-recurso>`
5. **Crie um pull request.**

## Suporte

Para dúvidas entre em contato com o desenvolvedor [Lucas Salomão](lucastadeusalomao@gmail.com).

### Licença

Este projeto está licenciado sob a licença [MIT](https://console.cloud.google.com/LICENSE).
