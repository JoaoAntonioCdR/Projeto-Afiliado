function formatarMoeda(valor) {
    if (valor === null || isNaN(valor)) {
        return "R$ 0,00"; // Retorna um valor padrão se o número for inválido
    }
    // Usa a API de internacionalização do JavaScript para formatar a moeda
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

const urlApi = '/api';

// Estado global para guardar os filtros, busca e página
let currentFilters = {
    categoria: '',
    plataforma: '',
    searchTerm: '',
    page: 0
};

// Função para buscar e renderizar filtros dinamicamente
async function carregarFiltros(filterType, containerId, apiEndpoint) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<span class="filter-label">${filterType === 'plataforma' ? 'Lojas:' : 'Categorias:'}</span>`;

    // Botão "Todas" padrão
    const allButton = document.createElement('button');
    allButton.classList.add('filter-button', 'active');
    allButton.dataset.filterType = filterType;
    allButton.dataset.filterValue = '';
    allButton.textContent = 'Todas';
    container.appendChild(allButton);

    try {
        const response = await fetch(`${urlApi}/${apiEndpoint}`);
        if (!response.ok) {
            throw new Error(`Erro ao carregar ${filterType}s: ${response.statusText}`);
        }
        const items = await response.json();

        items.forEach(item => {
            const button = document.createElement('button');
            button.classList.add('filter-button');
            button.dataset.filterType = filterType;
            button.dataset.filterValue = item;
            button.textContent = item;
            container.appendChild(button);
        });

    } catch (error) {
        console.error(`Falha ao carregar ${filterType}s:`, error);
    }
}

// Função principal que busca os produtos com base no estado global
async function carregarProdutos() {
    // Monta a URL com os parâmetros de filtro, busca e paginação
    const params = new URLSearchParams({
        page: currentFilters.page,
        size: 30
    });

    if (currentFilters.categoria) params.append('categoria', currentFilters.categoria);
    if (currentFilters.plataforma) params.append('plataforma', currentFilters.plataforma);
    if (currentFilters.searchTerm) params.append('searchTerm', currentFilters.searchTerm);

    const grid = document.getElementById('grid-produtos');
    grid.innerHTML = '<p>Buscando ofertas...</p>';

    try {
        const response = await fetch(`${urlApi}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.statusText}`);
        }
        const data = await response.json();

        renderizarCards(data.content);
        renderizarPaginacao(data.totalPages, data.number);

    } catch (error) {
        console.error("Falha ao carregar produtos:", error);
        grid.innerHTML = "<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
    }
}

// Função para renderizar os cards dos produtos
// Substitua sua função renderizarCards por esta versão
function renderizarCards(lista) {
    const container = document.getElementById('grid-produtos');
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhuma oferta encontrada com os filtros selecionados.</p>";
        return;
    }

    lista.forEach(produtoData => {
        const produto = new ProdutoModel(produtoData);
        let precoOriginalHtml = '';

        // A formatação é aplicada aqui
        if (produto.precoOriginal > 0) {
            precoOriginalHtml = `<div class="card-preco-original">
                        <p class="preco-original">De: <span class="preco-original-valor">${formatarMoeda(produto.precoOriginal)}</span></p>
                        </div>`;
        }

        const card = `
            <div class="card-produto">
                <div class="card">
                    <div class="card-image">
                        <img src="${produto.imagemUrl}" class="card-img-top" alt="${produto.titulo}">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${produto.titulo}</h3>
                        ${precoOriginalHtml}
                        <div class="card-preco-desconto">
                        <p class="card-text">Por apenas: <span id="preco-desconto">${formatarMoeda(produto.precoAVista)}</span></p>
                        </div>
                        <div class="btn-comprar">
                            <button class="card-button"><a href="${produto.linkAfiliado}" target="_blank">Ver Promoção</a></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Função para renderizar a paginação
function renderizarPaginacao(totalPages, currentPage) {
    const container = document.getElementById('paginacao-container');
    container.innerHTML = '';

    if (totalPages <= 1) return;

    const prevPage = currentPage - 1;
    const nextPage = currentPage + 1;

    container.innerHTML += `<li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${prevPage}">Anterior</a>
    </li>`;

    for (let i = 0; i < totalPages; i++) {
        container.innerHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
        </li>`;
    }

    container.innerHTML += `<li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${nextPage}">Próximo</a>
    </li>`;
}

// Função para resetar visualmente os botões de filtro
function resetarFiltrosVisuais() {
    document.querySelectorAll('.filter-button').forEach(btn => {
        if (btn.dataset.filterValue === '') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// --- LÓGICA DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {

    // Carregar filtros dinamicamente
    carregarFiltros('plataforma', 'plataforma-filters', 'plataformas');
    carregarFiltros('categoria', 'categoria-filters', 'categorias');

    // Evento de clique nos filtros de categoria/loja
    const filtersContainer = document.querySelector('.filters-container');
    if (filtersContainer) {
        filtersContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-button')) {
                const button = event.target;

                // Limpa a busca ao usar filtros
                currentFilters.searchTerm = '';
                const searchInput = document.getElementById('search-input');
                if (searchInput) searchInput.value = '';

                // Aplica o filtro clicado
                currentFilters[button.dataset.filterType] = button.dataset.filterValue;
                currentFilters.page = 0;

                // Atualiza a classe 'active'
                document.querySelectorAll(`.filter-button[data-filter-type="${button.dataset.filterType}"]`).forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                carregarProdutos();
            }
        });
    }

    // Evento de submit do formulário de busca
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchInput = document.getElementById('search-input');
            const searchTerm = searchInput.value.trim();

            // Limpa os filtros de categoria/plataforma ao fazer uma busca
            currentFilters.categoria = '';
            currentFilters.plataforma = '';
            resetarFiltrosVisuais();

            // Atualiza o estado da busca
            currentFilters.searchTerm = searchTerm;
            currentFilters.page = 0;

            carregarProdutos();
        });
    }

    // Evento de clique na paginação
    const paginationContainer = document.getElementById('paginacao-container');
    if(paginationContainer) {
        paginationContainer.addEventListener('click', (event) => {
            event.preventDefault();
            if(event.target.tagName === 'A' && event.target.dataset.page) {
                const page = parseInt(event.target.dataset.page, 10);
                if (page >= 0) {
                    currentFilters.page = page;
                    carregarProdutos();
                }
            }
        });
    }
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.main-nav');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            // Adiciona ou remove a classe 'is-active' no elemento <nav>
            navMenu.classList.toggle('is-active');
        });
    }

    // Carga inicial dos produtos
    carregarProdutos();
});