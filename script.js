/* =========================================================
   BIBLIOTECA CEEP
   SISTEMA DE GERENCIAMENTO
========================================================= */


/* =========================================================
   DADOS INICIAIS
========================================================= */

const livrosPadrao = [

    {
        id: 1,
        titulo: "Dom Casmurro",
        autor: "Machado de Assis",
        categoria: "Literatura",
        ano: 1899,
        localizacao: "Estante A - Prateleira 1",
        sinopse:
            "Um dos maiores clássicos da literatura brasileira, narrado por Bentinho."
    },

    {
        id: 2,
        titulo: "O Pequeno Príncipe",
        autor: "Antoine de Saint-Exupéry",
        categoria: "Infantil",
        ano: 1943,
        localizacao: "Estante B - Prateleira 2",
        sinopse:
            "Uma história sobre amizade, amor e a importância de enxergar além das aparências."
    },

    {
        id: 3,
        titulo: "Viagem ao Centro da Terra",
        autor: "Júlio Verne",
        categoria: "Literatura",
        ano: 1864,
        localizacao: "Estante A - Prateleira 3",
        sinopse:
            "Uma aventura fantástica pelas profundezas do planeta."
    },

    {
        id: 4,
        titulo: "Uma Breve História do Tempo",
        autor: "Stephen Hawking",
        categoria: "Ciências",
        ano: 1988,
        localizacao: "Estante C - Prateleira 1",
        sinopse:
            "Uma introdução às principais ideias sobre o universo, tempo e física."
    },

    {
        id: 5,
        titulo: "O Meu Pé de Laranja Lima",
        autor: "José Mauro de Vasconcelos",
        categoria: "Literatura",
        ano: 1968,
        localizacao: "Estante A - Prateleira 4",
        sinopse:
            "A emocionante história de Zezé e seu amigo imaginário."
    },

    {
        id: 6,
        titulo: "Atlas de Geografia",
        autor: "Editora Escolar",
        categoria: "Geografia",
        ano: 2024,
        localizacao: "Estante D - Prateleira 1",
        sinopse:
            "Material de apoio para estudos de geografia e conhecimento do espaço."
    }

];


let livros =
    JSON.parse(localStorage.getItem("livros")) ||
    livrosPadrao;


let emprestimos =
    JSON.parse(localStorage.getItem("emprestimos")) ||
    [];


/* =========================================================
   ELEMENTOS
========================================================= */

const pesquisa =
    document.getElementById("pesquisa");

const filtroCategoria =
    document.getElementById("filtroCategoria");

const listaLivros =
    document.getElementById("listaLivros");

const tabelaEmprestimos =
    document.getElementById("tabelaEmprestimos");

const modalEmprestimo =
    document.getElementById("modalEmprestimo");

const formEmprestimo =
    document.getElementById("formEmprestimo");

const formLivro =
    document.getElementById("formLivro");


/* =========================================================
   SALVAR DADOS
========================================================= */

function salvarDados() {

    localStorage.setItem(
        "livros",
        JSON.stringify(livros)
    );

    localStorage.setItem(
        "emprestimos",
        JSON.stringify(emprestimos)
    );

}


/* =========================================================
   DATA ATUAL
========================================================= */

function mostrarDataAtual() {

    const elemento =
        document.getElementById("dataAtual");

    if (!elemento) return;

    const agora = new Date();

    const texto =
        agora.toLocaleDateString(
            "pt-BR",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    elemento.textContent =
        texto.charAt(0).toUpperCase() +
        texto.slice(1);

}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function escaparHTML(texto) {

    if (texto === null || texto === undefined) {
        return "";
    }

    return String(texto)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function formatarData(data) {

    if (!data) {
        return "-";
    }

    const partes =
        data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


function dataHojeISO() {

    const hoje = new Date();

    const ano =
        hoje.getFullYear();

    const mes =
        String(
            hoje.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            hoje.getDate()
        ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;

}


function livroEmprestado(id) {

    return emprestimos.some(
        emprestimo =>
            Number(emprestimo.livroId) === Number(id)
    );

}


function obterEmprestimoDoLivro(id) {

    return emprestimos.find(
        emprestimo =>
            Number(emprestimo.livroId) === Number(id)
    );

}


function livroEstaAtrasado(emprestimo) {

    if (!emprestimo) {
        return false;
    }

    const hoje =
        new Date();

    const devolucao =
        new Date(
            `${emprestimo.dataDevolucao}T23:59:59`
        );

    return hoje > devolucao;

}


function iniciais(nome) {

    if (!nome) {
        return "AL";
    }

    const partes =
        nome.trim().split(/\s+/);

    if (partes.length === 1) {
        return partes[0]
            .substring(0, 2)
            .toUpperCase();
    }

    return (
        partes[0][0] +
        partes[partes.length - 1][0]
    ).toUpperCase();

}


function classeCapa(id) {

    const numero =
        ((Number(id) - 1) % 6) + 1;

    return `cover-${numero}`;

}


/* =========================================================
   MOSTRAR LIVROS
========================================================= */

function mostrarLivros() {

    if (!listaLivros) return;

    const termo =
        (pesquisa?.value || "")
            .trim()
            .toLowerCase();

    const categoria =
        filtroCategoria?.value || "";

    const filtrados =
        livros.filter(livro => {

            const titulo =
                livro.titulo.toLowerCase();

            const autor =
                livro.autor.toLowerCase();

            const correspondePesquisa =
                titulo.includes(termo) ||
                autor.includes(termo);

            const correspondeCategoria =
                categoria === "" ||
                livro.categoria === categoria;

            return (
                correspondePesquisa &&
                correspondeCategoria
            );

        });


    listaLivros.innerHTML = "";


    if (filtrados.length === 0) {

        listaLivros.innerHTML = `

            <div class="no-books">

                <i class="fa-solid fa-book-open"></i>

                <strong>
                    Nenhum livro encontrado
                </strong>

                <span>
                    Tente
