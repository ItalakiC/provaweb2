// Botão de tema claro e escuro, localiza por id o botão "escuta" o click do user
document.getElementById('botaoTema').addEventListener('click', function () {
    // adiciona a classe dar mode ao corpo do html se não existir e remove se ja existir, sendo um toggle
    document.body.classList.toggle('dark-mode');
});

const LIMITE = 10;

const cards = Array.from(document.querySelectorAll('.bloco-produto'));
const campoBusca = document.getElementById('busca-nome');
const botoesFiltro = document.querySelectorAll('.filtro');
const semResultado = document.getElementById('sem-resultado');

const armazenamento = sessionStorage;

function lerDados(chave, padrao) {
    const texto = armazenamento.getItem(chave);
    if (texto === null) return padrao;
    return JSON.parse(texto);
}

// Tranforma o array de dados em texto 
function salvarDados(chave, valor) {
    const texto = JSON.stringify(valor);
    armazenamento.setItem(chave, texto);
}

// Guarda a categoria ativada, inicia exibindo todas
let categoriaAtual = 'todas';

// Todo texto buscado sera tratado como minuscula
function normalizar(texto) {
    return texto.toLowerCase();
}
// Calcula e atualiza quais noticias devem aparecer na tela
function atualizarLista() {
    // Tira espaços extras nas pontas e transfoma em minuscula para o texto que for digitado na busca
    const termo = normalizar(campoBusca.value.trim());

    // Filtra os cards e retorna so os correspondentes aos filtros
    const correspondentes = cards.filter(function (card) {
        // Verifica se a categoria do card bate com a selecionada ou se esta em todas
        const categoriaOk = categoriaAtual === 'todas' || card.dataset.categoria === categoriaAtual;
        const titulo = normalizar(card.querySelector('h5').textContent);
        // Retorna verdadeira se a categoria estiver correta e o titulo tiver o termo buscado
        return categoriaOk && titulo.includes(termo);
    });

    // Percorre a lista completa de noticias para aplicar as regras de visibilidade
    cards.forEach(function (card) {
        // Descobre a posição do card dentro da lista dos cards que foram filtrados (-1 se não passou)
        const indice = correspondentes.indexOf(card);
        //Determina que o card sera visivel se passou no fitro
        const visivel = indice !== -1 && (indice < LIMITE);
        // Aplica propriedade de esconder se true e exibir se false
        card.hidden = !visivel;
    });

    // Esconde a mensagem de sem resultados se algum card foi encontrado
    semResultado.hidden = correspondentes.length > 0;
    // Esconde o botao de mostrar mais caso a lista ja tenha sido expandida ou não houver quantidade suficiente para isso
}

// Faz o evento de click individual para cada botao de categoria
botoesFiltro.forEach(function (botao) {
    botao.addEventListener('click', function () {
        // Remove a classe CSS atvio de todos os botões de filtro para desmarcar
        botoesFiltro.forEach(function (b) { b.classList.remove('ativo'); });
        // Adiciona a classe ativo ao botão que foi clicado
        botao.classList.add('ativo');
        // Lê o valor do atributo data-filtro do botão clicado e atualiza 
        categoriaAtual = botao.dataset.filtro;
        atualizarLista();
    });
});

// Pega a digitação no campode busca em tempo real
campoBusca.addEventListener('input', function () {
    atualizarLista();
});

atualizarLista();

// Formulário de e-mail ao enviar, só limpa o campo
document.getElementById('formEmail').addEventListener('submit', function (e) {
    // Previne o carregamento automatico da pagina padrão de envios de formulario
    e.preventDefault();
    // Reseta o campo digitado pelo user
    this.reset();
});

function escolherItem(id) {
    const produto = cardapio.buscar(id);
    carrinho.adicionar(prato);
    atualizarContador();

    document.getElementById('textoToast').textContent = `${prato.nome} adicionado ao carrinho`;
    bootstrap.Toast.getOrCreateInstance(document.getElementById('toastCarrinho')).show();
}

// transforma o texto em objeto no array, caso não haja nenhum texto, como abrindo a página pela primeira vez só retorna o padrão que é array vazia
function lerDados(chave, padrao) {
    const texto = armazenamento.getItem(chave);
    if (texto === null) return padrao;
    return JSON.parse(texto);
}

class Produto {
    constructor(id, nome, preco, imagem) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.imagem = imagem;
    }
}

class ListaItens {
    constructor() {
        this.produtos = lerDados('lista', []).map(p => new Produto(p.id, p.nome, p.preco, p.imagem));
    }

    salvar() { salvarDados('lista', this.produtos); }
    cadastrar(nome, preco, imagem) {
        const id = Math.max(0, ...this.produtos.map(p => p.id)) + 1;
        this.produtos.push(new Produto(id, nome, preco, imagem));
        this.salvar();
    }
}
