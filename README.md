# 🎥 fanCollectorsMedia 
[![NPM](https://img.shields.io/npm/l/react)](https://github.com/wagnerdf/fan-collectors-frontend/LICENSE) 

Sistema para colecionadores de mídias físicas (Blu-ray, DVD, VHS, LP, CD, Cartuchos...), permitindo cadastro detalhado para midia fśicas, salvando, editando, deletando e visualizando todos registro de cada usuário, integração com a API TMDB e outras que serão acresentadas com o desenvolvimento da aplicação web, autenticação de usuários, publicação de potagens e muito mais!

---

## 📱 Download do APK

Baixe a versão mais recente do aplicativo **FanCollectionMidia** para Android:

👉 [⬇️ FanCollectionMidia v1.0.0 (Preview)](https://drive.google.com/file/d/1GQ_9pI_UQdOjtb-5Nbh3dpR5V3_4LBhh/view?usp=sharing)

👤 Usuário de Teste

Para testar o aplicativo, utilize o seguinte usuário temporário:

**Login:** `admin@admin`  
**Senha:** `admin`

> ⚠️ Este é um usuário de demonstração apenas para testes públicos.  
> Algumas funções (como cadastro ou edição de usuário) ainda estão em desenvolvimento.


**Informações da build:**
- Versão: `1.0.0`
- Tipo: `Preview (Release APK)`
- Data de build: **05/11/2025**
- Tamanho: ~91 MB
- Compatibilidade: Android 7.0 (Nougat) ou superior
- Status: ✅ Testado e funcional via EAS Build

---

## 🚀 Demonstração Web

Você pode acessar a aplicação em produção pelo link abaixo:

👉 [https://fan-collectors-frontend-app.vercel.app/](https://fan-collectors-frontend-app.vercel.app/)

**Login:** `admin@admin`  
**Senha:** `admin`

[![Deploy](https://img.shields.io/badge/🔗%20Deploy-Vercel-blue?style=flat&logo=vercel)](https://fan-collectors-frontend-app.vercel.app/)

---

## 📱 Layout mobile

<p align="center">
  <img src="https://i.imgur.com/uZTG6rh.jpeg" width="220" style="margin:10px;" />
  <img src="https://i.imgur.com/Y9vGG3V.jpeg" width="220" style="margin:10px;" />
</p>
<p align="center">
  <span style="color:#ff6b6b; font-size:18px;">🟢 Tela Inicial Usuário</span> 
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <span style="color:#4dabf7; font-size:18px;">🟣 Tela de Login</span>
</p>

<p align="center">
  <img src="https://i.imgur.com/4H88Umu.jpeg" width="220" style="margin:10px;" />
  <img src="https://i.imgur.com/FAFZoCk.jpeg" width="220" style="margin:10px;" />
</p>
<p align="center">
  <span style="color:#51cf66; font-size:18px;">🔵 Tela de Biblioteca</span> 
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <span style="color:#ffd43b; font-size:18px;">🟠 Detalhes da Mídia</span>
</p>

<p align="center">
  <img src="https://i.imgur.com/qEQceER.jpeg" width="220" style="margin:10px;" />
</p>
<p align="center">
  <span style="color:#845ef7; font-size:18px;">🟡 Tela de Edição de Usuário</span>
</p>

---

## 🖥️ Layout web

<div align="center">
  <img src="https://i.imgur.com/aZ7RXPZ.png" width="400" alt="Tela apresentação" />
  <br/>
  <img src="https://i.imgur.com/mJbJwTE.png" width="400" alt="Tela de Login" />
  <br/>
  <img src="https://i.imgur.com/F621Hxb.png" width="700" alt="Cadastro de Mídia" />
</div>

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
- Railway
- Maven
- Lombok
- Bean Validation
- ModelMapper (ou MapStruct - futuro)
- Integração com [TMDB API](https://www.themoviedb.org/documentation/api) e [NEWSDATA](https://newsdata.io/)

### 💻 Frontend (React + TypeScript)

- React 18+ / React Native
- TypeScript
- TailwindCSS
- Axios
- Expo
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
- [x] Notícias de entretenimento** (cinema, música e jogos) no sidebar, rotativas a cada 10 minutos.
- [ ] Upload de imagem de capa
- [x] Validação de campos obrigatórios
- [x] Dashboard com exibição das mídias cadastradas
- [x] Filtro e busca por título 
- [x] Edição de titulo 
- [x] Exlusão de título
- [ ] Postagens e publicação de midias dos usuários compartilhados (em breve)
- [x] Responsividade para mobile

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
| Desenvolvedor Fullstack Java/React/PHP.... |
</br>
| [LinkedIn](https://www.linkedin.com/in/wagner-andrade-876b6460) |
</br> 
| [GitHub](https://github.com/WagnerDf) |

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma _issue_, enviar _pull requests_ ou sugerir melhorias.

---

## 🌐 API: TMDB e NEWSDATA

Este projeto usa a API pública do [TMDB](https://www.themoviedb.org/) e [NEWSDATA](https://newsdata.io/).  
Você precisa gerar uma **chave de API** gratuita para usar os recursos de busca automática de filmes e séries e a da NewsData para receber noticias.

---

## 💡 Inspiração

Criado especialmente para apaixonados por colecionar mídias físicas, este sistema oferece uma forma prática e moderna de catalogar, visualizar e gerenciar suas coleções com riqueza de detalhes.

---

> Criado com 💙 por WagnerDF