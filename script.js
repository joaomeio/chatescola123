/*
 * Script principal para o sistema de perguntas e respostas.
 *
 * Esta versão permite que as perguntas e respostas sejam armazenadas
 * tanto localmente (via LocalStorage) quanto globalmente (via Firebase
 * Realtime Database). Caso as credenciais do Firebase sejam
 * preenchidas em `firebaseConfig`, os dados serão sincronizados em
 * tempo real entre todos os usuários conectados. Se as credenciais
 * permanecerem com valores genéricos, o sistema utiliza apenas o
 * LocalStorage do navegador, de modo que as perguntas ficam salvas
 * apenas no dispositivo do usuário.
 */

(function() {
    // Chave para o LocalStorage quando Firebase não é utilizado
    const DATA_KEY = 'qaDataLocal';

    // --- Configuração do Firebase ---
    // Substitua os valores abaixo pelas credenciais do seu projeto
    // obtidas no console do Firebase. Caso você deixe os valores
    // 'YOUR_API_KEY', 'YOUR_PROJECT', etc., o Firebase não será
    // inicializado e o site funcionará apenas com armazenamento local.
    const firebaseConfig = {
        // Configuração real do Firebase fornecida pelo usuário.
        // Esta chave API e demais parâmetros permitem que o sistema
        // salve e sincronize as perguntas no projeto "chatescola".
        apiKey: 'AIzaSyCzLgpr91oAr4EVLsw-7cqm7p2RXtX2Mo8',
        authDomain: 'chatescola.firebaseapp.com',
        databaseURL: 'https://chatescola-default-rtdb.firebaseio.com',
        projectId: 'chatescola',
        // O bucket de armazenamento padrão deve usar o domínio appspot.com
        storageBucket: 'chatescola.appspot.com',
        messagingSenderId: '360130499108',
        appId: '1:360130499108:web:b3d3b528cd136de2527eb1',
        measurementId: 'G-2BXPP3NGTD'
    };

    let db = null;
    let useFirebase = false;
    try {
        // Apenas inicializa se a apiKey não contém a string de placeholder
        if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_API_KEY')) {
            firebase.initializeApp(firebaseConfig);
            db = firebase.database();
            useFirebase = true;
        }
    } catch (e) {
        console.warn('Falha ao inicializar Firebase, utilizando somente armazenamento local.', e);
        useFirebase = false;
    }

    /**
     * Lê os dados armazenados localmente.
     * @returns {Array<{question: string, answer: string}>}
     */
    function loadLocalData() {
        const json = localStorage.getItem(DATA_KEY);
        try {
            return json ? JSON.parse(json) : [];
        } catch (err) {
            console.error('Erro ao ler os dados do localStorage:', err);
            return [];
        }
    }

    /**
     * Salva um array de perguntas e respostas no LocalStorage.
     * @param {Array<{question: string, answer: string}>} data
     */
    function saveLocalData(data) {
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    }

    /**
     * Atualiza o contêiner de perguntas e respostas com base em um array.
     * @param {HTMLElement} container
     * @param {Array<{question: string, answer: string}>} data
     */
    function renderListFromArray(container, data) {
        container.innerHTML = '';
        if (!data || data.length === 0) {
            const noItems = document.createElement('p');
            noItems.textContent = 'Nenhuma pergunta cadastrada ainda.';
            container.appendChild(noItems);
            return;
        }
        data.forEach(item => {
            const wrapper = document.createElement('div');
            wrapper.className = 'p-4 border rounded-lg bg-gray-50';
            const q = document.createElement('p');
            q.className = 'font-semibold mb-1';
            q.textContent = item.question;
            const a = document.createElement('p');
            a.className = 'text-gray-700 whitespace-pre-wrap';
            a.textContent = item.answer;
            wrapper.appendChild(q);
            wrapper.appendChild(a);
            container.appendChild(wrapper);
        });
    }

    /**
     * Configura a escuta de dados dependendo de onde os dados estão.
     * Se Firebase estiver configurado, conecta ao nó 'qaData' e atualiza
     * em tempo real. Caso contrário, carrega do LocalStorage.
     * @param {HTMLElement} container
     */
    function setupDataListener(container) {
        if (useFirebase && db) {
            db.ref('qaData').on('value', snapshot => {
                const obj = snapshot.val() || {};
                const arr = Object.values(obj);
                renderListFromArray(container, arr);
            });
        } else {
            const arr = loadLocalData();
            renderListFromArray(container, arr);
        }
    }

    /**
     * Adiciona uma nova entrada (pergunta e resposta) ao armazenamento.
     * Se Firebase estiver em uso, a entrada é enviada ao banco de dados
     * remoto; caso contrário, a entrada é adicionada ao LocalStorage.
     * @param {string} question
     * @param {string} answer
     * @param {HTMLElement} container Contêiner para atualizar imediatamente se LocalStorage estiver em uso
     */
    function addQA(question, answer, container) {
        if (useFirebase && db) {
            db.ref('qaData').push({ question, answer });
        } else {
            const current = loadLocalData();
            current.push({ question, answer });
            saveLocalData(current);
            if (container) {
                renderListFromArray(container, current);
            }
        }
    }

    /**
     * Retorna a senha atual do administrador. Se não houver senha
     * definida, retorna 'admin123'.
     * @returns {string}
     */
    function getAdminPassword() {
        return localStorage.getItem('adminPassword') || 'admin123';
    }

    // --------------------- Lógica de login ---------------------
    const loginForm = document.getElementById('login-form');
    const guestBtn = document.getElementById('guest-btn');
    const errorEl = document.getElementById('login-error');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const passwordInput = document.getElementById('password');
            const password = passwordInput.value;
            if (password === getAdminPassword()) {
                sessionStorage.setItem('isAdmin', 'true');
                window.location.href = 'admin.html';
            } else {
                if (errorEl) {
                    errorEl.classList.remove('hidden');
                }
            }
        });
    }
    if (guestBtn) {
        guestBtn.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = 'qa.html';
        });
    }

    // ------------------- Proteção de rota ---------------------
    if (window.location.pathname.endsWith('admin.html')) {
        if (!sessionStorage.getItem('isAdmin')) {
            window.location.href = 'index.html';
        }
    }

    // ---------------- Página do administrador -----------------
    const qaForm = document.getElementById('qa-form');
    if (qaForm) {
        const qaListContainer = document.getElementById('qa-list');
        // Carrega os dados e configura atualizações em tempo real
        setupDataListener(qaListContainer);
        qaForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const questionInput = document.getElementById('question');
            const answerInput = document.getElementById('answer');
            const question = questionInput.value.trim();
            const answer = answerInput.value.trim();
            if (!question || !answer) {
                return;
            }
            addQA(question, answer, qaListContainer);
            questionInput.value = '';
            answerInput.value = '';
        });
    }

    // ---------------- Página pública -------------------------
    if (!qaForm) {
        const qaListContainer = document.getElementById('qa-list');
        if (qaListContainer) {
            setupDataListener(qaListContainer);
        }
    }

    // ---------------- Alteração de senha ----------------------
    const changePwdLink = document.getElementById('change-password-link');
    if (changePwdLink) {
        changePwdLink.addEventListener('click', function(event) {
            event.preventDefault();
            const newPwd = prompt('Digite a nova senha de administrador:');
            if (newPwd && newPwd.trim().length > 0) {
                localStorage.setItem('adminPassword', newPwd.trim());
                alert('Senha do administrador atualizada com sucesso!');
            }
        });
    }
})();