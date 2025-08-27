const urlApi = 'http://localhost:8080/api';
let todosOsProdutosParaPesquisa = []; // Guarda produtos para a função de pesquisa

// Função principal que busca os produtos de uma página específica
async function carregarProdutos(page = 0) {
    try {
        const response = await fetch(`${urlApi}?page=${page}&size=30`);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }
        const data = await response.json();

        // PONTO CRÍTICO: Os produtos agora estão dentro de `data.content`
        renderizarCards(data.content);
        renderizarPaginacao(data.totalPages, data.number);

    } catch (error) {
        console.error("Falha ao carregar produtos:", error);
        document.getElementById('grid-produtos').innerHTML = "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
    }
}

// Sua função de renderizar cards (sem alterações)
function renderizarCards(lista) {
    const container = document.getElementById('grid-produtos');
    container.innerHTML = "";

    lista.forEach(produtoData => {
        const produto = new ProdutoModel(produtoData);
        let precoOriginalHtml = '';
        if (produto.precoOriginal > 0) {
            precoOriginalHtml = `<p id="preco-original" class="card-text">Preco Original: ${produto.precoOriginal}</p>`;
        }
        const card = `
            <div class="card-produto">
                <div class="card">
                    <div class="card-image">
                        <img src="${produto.imagemUrl}" class="card-img-top ${produto.plataforma}" alt="Imagem do Produto">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${produto.titulo}</h5>
                        ${precoOriginalHtml}
                        <p class="card-text ">Preco com desconto: ${produto.precoAVista}</p>
                        <button class="card-button"><a href="${produto.linkAfiliado}" target="_blank">Comprar agora</a></button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Função NOVA para criar os botões de paginação
function renderizarPaginacao(totalPages, currentPage) {
    const container = document.getElementById('paginacao-container');
    container.innerHTML = '';

    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;

    // Botão Anterior
    container.innerHTML += `<li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="event.preventDefault(); carregarProdutos(${prevPage});">Anterior</a>
    </li>`;

    // Botões de Página
    for (let i = 0; i < totalPages; i++) {
        container.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="event.preventDefault(); carregarProdutos(${i});">${i + 1}</a>
        </li>`;
    }

    // Botão Próximo
    container.innerHTML += `<li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="event.preventDefault(); carregarProdutos(${nextPage});">Próximo</a>
    </li>`;
}


// A função de pesquisa precisa ser adaptada
async function inicializarPesquisa() {
    // Para simplificar, a pesquisa buscará apenas na página atual.
    // Uma pesquisa global exigiria uma nova lógica de backend.
}


// Carga inicial do site
carregarProdutos(0);