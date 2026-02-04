# 🎥 fanCollectorsMedia 
[![License](https://img.shields.io/github/license/wagnerdf/fanCollectorsMedia-mobile)](https://github.com/wagnerdf/fanCollectorsMedia-mobile/blob/main/LICENSE)
[![Java](https://img.shields.io/badge/Java-17+-orange?logo=java&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3+-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-Mobile-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-Platform-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Railway](https://img.shields.io/badge/Railway-Cloud-0B0D0E?logo=railway&logoColor=white)](https://railway.app/)


Sistema para colecionadores de mídias físicas (Blu-ray, DVD, VHS, LP, CD, cartuchos, etc.), permitindo o cadastro detalhado de mídias físicas, com funcionalidades para salvar, editar, excluir e visualizar todos os registros de cada usuário.

O sistema conta com autenticação de usuários, integração com a API do TMDB e outras que serão adicionadas ao longo do desenvolvimento da aplicação web, além de publicação de postagens e muitos outros recursos.

---

## 📱 Download do APK

Baixe a versão mais recente do aplicativo **FanCollectionMidia** para Android:

👉 [⬇️ FanCollectionMidia v1.0.8 (Preview)](https://drive.google.com/file/d/1fY_KbXFb9BgPhkoeN13AJYJ3GG865fwG/view?usp=sharing)

👤 Usuário de Teste

**Login:** `admin@admin`  
**Senha:** `admin`

> ⚠️ Este é um usuário de demonstração apenas para testes públicos.  
> Algumas funções ainda estão em desenvolvimento.

**Informações da build:**
- Versão: `1.0.8`
- Tipo: `Preview (Release APK)`
- Data de build: **02/02/2026**
- Tamanho: ~93 MB
- Compatibilidade: Android 7.0 (Nougat) ou superior
- Status: ✅ Testado e funcional via EAS Build

**Novidades desta versão (1.0.8):**
- 🎨 Atualização completa da identidade visual do app (ícone e splash screen).
- 📱 Correção definitiva do ícone branco no launcher Android.
- 🖼️ Implementação correta do Adaptive Icon para Android.
- 🚀 Sincronização dos assets visuais com o build via Expo / EAS.
- 🧹 Limpeza e reconstrução do projeto nativo para garantir consistência de build.

---

## 🚀 Demonstração Web

Você pode acessar a aplicação em produção pelo link abaixo:

👉 [https://fan-collectors-frontend-app.vercel.app/](https://fan-collectors-frontend-app.vercel.app/)

**Login:** `admin@admin`  
**Senha:** `admin`

[![Deploy](https://img.shields.io/badge/🔗%20Deploy-Vercel-blue?style=flat&logo=vercel)](https://fan-collectors-frontend-app.vercel.app/)

---

## 📱 Layout mobile

<div align="center">

<table>
  <tr>
    <th>🟢 Tela Inicial Usuário</th>
    <th>🟣 Tela de Login</th>
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/EPSBsMs.jpeg" width="220"></td>
    <td><img src="https://i.imgur.com/9R5l7yZ.jpeg" width="220"></td>
  </tr>
</table>

<table>
  <tr>
    <th>🔵 Tela de Menu</th>
    <th>🟠 Tela de Biblioteca</th>
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/XaHoKue.jpeg" width="220"></td>
    <td><img src="https://i.imgur.com/EY488Y8.jpeg" width="220"></td>
  </tr>
</table>

<table>
  <tr>
    <th>🟡 Detalhes da Mídia</th>
    <th>🔴 Tela Editar Usuário</th>
  </tr>
  <tr>
    <td><img src="https://i.imgur.com/Tkzx7cM.jpeg" width="220"></td>
    <td><img src="https://i.imgur.com/2Kq1TNx.jpeg" width="220"></td>
  </tr>
</table>

</div>

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

Abaixo está a tabela de funcionalidades organizadas por área do projeto.

| Funcionalidade                                                                 | Backend | Web | Mobile |
|-------------------------------------------------------------------------------|:-------:|:---:|:------:|
| Autenticação com JWT (Login, Cadastro, Validação)                             |   ✓     |  ✓  |   ✓    |
| Perfil do usuário com edição                                                  |   ✓     |  ✓  |   ✓    |
| Cadastro de mídias com dados do TMDB (Filmes e Séries)                       |   ✓     |  ✓  |   ✓    |
| Cadastro de mídias com dados do MusicBrainz API (Músicas)                    |   ⏳     |  ⏳ |   ⏳   |
| Cadastro de mídias com dados do RAWG API (Games)                             |   ⏳     |  ⏳ |   ⏳   |
| Notícias de entretenimento rotativas a cada 10 min                            |   ✓     |  ✓  |   ⏳    |
| Upload de imagem do usuário                                                      |   ⏳     |  ⏳ |   ⏳   |
| Validação de campos obrigatórios                                              |   ✓     |  ✓  |   ✓    |
| Dashboard com exibição das mídias cadastradas                                |   ✓     |  ✓  |   ✓    |
| Filtro e busca por título                                                     |   ✓     |  ✓  |   ✓    |
| Edição de título                                                              |   ✓     |  ✓ |   ✓   |
| Exclusão de título                                                            |   ✓     |  ✓ |   ✓   |
| Postagens e publicação de mídias pelos usuários                               |   ⏳     |  ⏳ |   ⏳   |
| Responsividade para mobile                                                    |   -     |  ✓  |   ✓    |

Legenda:  
**✓ concluído** — **⏳ em andamento** — **- não se aplica**

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

## 🌐 API: TMDB e NEWSDATA

Este projeto usa a API pública do TMDB e NEWSDATA.  
Você precisa gerar uma **chave de API** gratuita para usar os recursos de busca automática de filmes e séries e para receber notícias.

<table>
  <tr>
    <th align="center">🎬 TMDB — The Movie Database</th>
    <th align="center">📰 NEWSDATA — Dados de Notícias</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>Obtenção de filmes e séries</li>
        <li>Imagens, gêneros, notas e metadados</li>
        <li>Busca automática de títulos</li>
      </ul>
      <b>Documentação:</b><br>
      🔗 https://developer.themoviedb.org/<br>
      🔗 https://developer.themoviedb.org/reference/intro/getting-started
    </td>
    <td>
      <ul>
        <li>Notícias atualizadas</li>
        <li>Conteúdos relacionados a entretenimento</li>
        <li>Opção de tipos de notícias</li>
      </ul>
      <b>Documentação:</b><br>
      🔗 https://newsdata.io/<br>
      🔗 https://newsdata.io/documentation
    </td>
  </tr>
</table>

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

> Criado com 💙 por WagnerDF
