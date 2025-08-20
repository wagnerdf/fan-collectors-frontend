# 🎥 fanCollectorsMedia 
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/wagnerdf/fan-collectors-frontend/LICENSE) 

Sistema para colecionadores de mídias físicas (Blu-ray, DVD, VHS, LP, CD, Cartuchos...), permitindo cadastro detalhado para midia fśicas, salvando, editando, deletando e visualizando todos registro de cada usuário, integração com a API TMDB e outras que serão acresentadas com o desenvolvimento da aplicação web, autenticação de usuários, publicação de potagens e muito mais!

---

## 🚀 Demonstração

Você pode acessar a aplicação em produção pelo link abaixo:

👉 [https://fan-collectors-frontend-app.vercel.app/](https://fan-collectors-frontend-app.vercel.app/)

[![Deploy](https://img.shields.io/badge/🔗%20Deploy-Vercel-blue?style=flat&logo=vercel)](https://fan-collectors-frontend-app.vercel.app/)


---

## 🖥️ Layout web

<div align="center">
  <img src="https://i.imgur.com/aZ7RXPZ.png" width="600" alt="Tela apresentação" />
  <br/>
  <img src="https://i.imgur.com/mJbJwTE.png" width="600" alt="Tela de Login" />
  <br/>
  <img src="https://i.imgur.com/F621Hxb.png" width="600" alt="Cadastro de Mídia" />
</div>

---

## 📱 Layout mobile

Em breve

---

## 📊 Modelo lógico/conceitual

<div align="center">
  <img src="https://i.imgur.com/yeYfyVf.png" width="600" alt="Modelo conceitual" />
</div>

---

## 🚀 Tecnologias

### 🧠 Backend (Java + Spring Boot)

- Spring Boot 3+
- Spring Security com JWT
- Spring Data JPA
- Flyway (migrações de banco)
- PostgreSQL
- Maven
- Lombok
- Bean Validation
- ModelMapper (ou MapStruct - futuro)
- Integração com [TMDB API](https://www.themoviedb.org/documentation/api)

### 💻 Frontend (React + TypeScript)

- React 18+
- TypeScript
- TailwindCSS
- Axios
- React Router DOM
- Formulários com validação
- Context API + Token JWT

---

## 🧩 Funcionalidades

- [x] Autenticação com JWT (Login, Cadastro, Validação)
- [x] Perfil do usuário com edição
- [x] Cadastro de mídias com dados preenchidos automaticamente via TMDB para Filmes e Series
- [ ] Cadastro de mídias com dados preenchidos automaticamente MusicBrainz API para Musicas (em breve)
- [ ] Cadastro de mídias com dados preenchidos automaticamente RAWG Video Games Database para Games (em breve)
- [x] Upload de imagem de capa
- [x] Validação de campos obrigatórios
- [x] Dashboard com exibição das mídias cadastradas
- [ ] Filtro e busca por título (em breve)
- [ ] Edição de titulo (em breve)
- [ ] Exlusão de título (em breve)
- [ ] Postagens e publicação de midias dos usuários compartilhados (em breve)
- [ ] Responsividade para mobile (em andamento)

---

## 🛠️ Como rodar localmente

### 📦 Backend

```bash
# Clone o projeto e navegue até a pasta backend
cd fanCollectorsMedia

# Configure o banco PostgreSQL
# Altere application.properties conforme necessário

# Rode o projeto com o Spring Tool Suite ou com:
./mvnw spring-boot:run
```

### 💻 Frontend

```bash
# Clone o projeto e navegue até a pasta frontend
cd fan-collectors-frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite a URL da API e a API_KEY do TMDB

# Rode o frontend
npm start
```

---

## 🔐 Variáveis de Ambiente (.env)

**Frontend**
```env
REACT_APP_API_URL=http://localhost:8080/fanCollectorsMedia/api
REACT_APP_API_TMDB=SUA_CHAVE_TMDB
```

**Backend (application.properties)**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fanCollectorsMedia
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=validate
```

---

## 🧪 Testes

- Testes unitários no backend com JUnit e Mockito
- Testes de integração (usuário + autenticação)

---

## 👤 Autor

<p align="left">
  <img src="https://avatars.githubusercontent.com/u/52794588?v=1" width="120" alt="WagnerDf"/>
</p>

| **Wagner Andrade (WagnerDf)** |
</br>
| Desenvolvedor Fullstack Java & React |
</br>
| [LinkedIn](https://www.linkedin.com/in/wagner-andrade-876b6460) |
</br> 
| [GitHub](https://github.com/WagnerDf) |

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma _issue_, enviar _pull requests_ ou sugerir melhorias.

---

## 🌐 API TMDB

Este projeto usa a API pública do [TMDB](https://www.themoviedb.org/).  
Você precisa gerar uma **chave de API** gratuita para usar os recursos de busca automática de filmes e séries.

---

## 💡 Inspiração

Este sistema foi idealizado para organizar coleções pessoais de mídia física com praticidade, visual moderno e dados completos.

---

> Criado com 💙 por WagnerDF
