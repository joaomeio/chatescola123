# Sistema de Perguntas e Respostas

Este repositório contém um pequeno site estático em HTML, CSS e JavaScript que permite a um administrador cadastrar perguntas e respostas e disponibilizá‑las para qualquer pessoa que acesse o site. O objetivo é oferecer uma forma simples de compartilhar dicas e explicações para trabalhos escolares a partir de um navegador sem a necessidade de um servidor backend.

## Funcionalidades

* **Autenticação simples:** A página inicial (`index.html`) permite que o administrador insira uma senha para acessar o painel de administração. Há também um botão para que visitantes entrem diretamente na lista de perguntas.
* **Cadastro de perguntas e respostas:** No painel de administração (`admin.html`), o administrador pode adicionar novas perguntas e respostas. As entradas são exibidas imediatamente em uma lista na mesma página.
* **Visualização pública:** A página `qa.html` exibe todas as perguntas e respostas cadastradas. Visitantes não podem editar nem excluir conteúdo.
* **Alteração de senha:** O administrador pode alterar a senha clicando em “Alterar senha” na barra de navegação do painel. A nova senha é gravada no armazenamento local do navegador.
* **Armazenamento local ou global:** Por padrão, todas as perguntas, respostas e a senha do administrador são salvas no [LocalStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage) do navegador. No entanto, o código já inclui suporte à integração com o **Firebase Realtime Database**. Ao configurar as credenciais no arquivo `script.js`, as perguntas e respostas serão sincronizadas automaticamente entre todos os usuários conectados. Caso você não configure o Firebase, o site permanece funcionando apenas com armazenamento local.

* **UI moderna:** A interface foi redesenhada utilizando a biblioteca [Tailwind CSS](https://tailwindcss.com/), oferecendo um visual mais moderno, responsivo e agradável em dispositivos móveis e desktops.

## Como hospedar no GitHub Pages

Para disponibilizar o site na internet (e possivelmente acessar pela rede Wi‑Fi da escola), você pode utilizar o GitHub Pages. Siga os passos abaixo:

1. **Crie um repositório no GitHub:** faça login na sua conta do GitHub, clique em **New repository** e escolha um nome (por exemplo, `perguntas-e-respostas`). Deixe o repositório como _public_ ou _private_, conforme preferir.
2. **Envie os arquivos:** faça download ou clone este repositório e copie o conteúdo da pasta `qa-site` para dentro do seu repositório no GitHub. Garanta que os arquivos `index.html`, `admin.html`, `qa.html`, `style.css`, `script.js` e `README.md` estejam na raiz do repositório.
3. **Faça o commit e push:** se estiver utilizando Git localmente, execute:

   ```bash
   git add .
   git commit -m "Publicar site de perguntas e respostas"
   git push origin main
   ```

   Alternativamente, você pode enviar os arquivos diretamente pela interface web do GitHub (botão **Add file** > **Upload files**).
4. **Ative o GitHub Pages:**

   1. Acesse a página do repositório no GitHub e clique em **Settings**.
   2. No menu lateral, escolha **Pages** (ou **Pages and deployment** em algumas versões).
   3. Em **Build and deployment**, selecione **Deploy from a branch**.
   4. Selecione a branch `main` (ou a branch padrão que você estiver usando) e a pasta raiz (`/`), depois clique em **Save**.
   5. O GitHub irá gerar uma URL do tipo `https://seu-usuario.github.io/nome-do-repositorio/`. Em poucos minutos o site estará disponível nesse endereço.

Agora você pode acessar a URL fornecida pelo GitHub Pages no navegador da escola para visualizar e gerenciar o conteúdo.

## Mudando a senha do administrador

Por padrão, a senha inicial do administrador é **`admin123`**. Após fazer login no painel, clique em **Alterar senha** para definir uma nova senha. A alteração é armazenada localmente no navegador em que você estiver logado. Se limpar os dados do navegador (limpar cache ou usar navegação anônima), a senha voltará ao valor padrão ou ao último valor salvo nesse dispositivo.

Se desejar definir uma senha inicial diferente do `admin123` para todos os usuários, você pode editar diretamente o arquivo `script.js`. Procure a função `getAdminPassword()` e altere o valor retornado quando não houver senha salva no LocalStorage.

## Personalização e melhorias

Este projeto é intencionalmente simples para facilitar a publicação em um ambiente estático. Algumas melhorias que você pode implementar caso tenha familiaridade com programação web:

* **Sincronização de dados:** integrar o site com um banco de dados em tempo real (por exemplo, Firebase) para que todos os usuários vejam as mesmas perguntas e respostas.
* **Design responsivo avançado:** ajustar o layout e as cores conforme as preferências da sua turma ou escola.
* **Funcionalidades extras:** permitir edição e exclusão de perguntas, categorização de assuntos, campo de pesquisa ou ordem de exibição por data.

Sinta‑se à vontade para adaptar e expandir o projeto conforme as suas necessidades!

## Sincronizando as perguntas globalmente via Firebase

Se você quer que as perguntas e respostas apareçam para todos os usuários (ou seja, sejam persistidas em um banco central), utilize o Firebase Realtime Database. O código já está preparado para isso, mas você precisa realizar a configuração inicial:

1. **Crie um projeto no Firebase:** acesse [console.firebase.google.com](https://console.firebase.google.com/) e clique em **Adicionar projeto**. Siga os passos, não é necessário adicionar o Google Analytics.
2. **Habilite o Realtime Database:** dentro do seu projeto, clique em **Realtime Database** no menu lateral, escolha **Criar banco de dados**, selecione o modo **Teste** (ou **Modo de produção** com regras apropriadas) e finalize. Isso criará a URL do banco (`https://seu-projeto.firebaseio.com`).
3. **Ajuste as regras de segurança (para fins de teste):** durante o desenvolvimento você pode permitir leituras e escritas públicas definindo as regras assim:

   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```

   **Importante:** essas regras tornam o banco acessível a qualquer pessoa. Em um ambiente real, você deve configurar regras mais restritas.
4. **Obtenha as credenciais da Web:** ainda no console, clique em **Configurações do projeto > Suas apps > Adicionar app** e escolha **Web**. O Firebase exibirá um objeto de configuração contendo `apiKey`, `authDomain`, `databaseURL`, `projectId`, `storageBucket`, `messagingSenderId` e `appId`.
5. **Substitua os placeholders no script:** abra o arquivo `script.js` e encontre o objeto `firebaseConfig`. Substitua cada propriedade pelos valores fornecidos no passo anterior. Por exemplo:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "seu-projeto.firebaseapp.com",
     databaseURL: "https://seu-projeto.firebaseio.com",
     projectId: "seu-projeto",
     storageBucket: "seu-projeto.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef123456"
   };
   ```

6. **Salve e faça novo deploy:** envie as alterações para o GitHub (ou atualize os arquivos via interface). Ao acessar o site depois do deploy, todas as perguntas adicionadas serão enviadas ao banco remoto e aparecerão instantaneamente para todos que estiverem no site.

Se você deixar os valores de `firebaseConfig` como estão (com `YOUR_API_KEY` etc.), o script funcionará apenas com armazenamento local. O armazenamento global depende exclusivamente de você configurar um projeto Firebase.