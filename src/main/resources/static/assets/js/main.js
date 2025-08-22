
const urlApi = 'http://localhost:8080/api';
let produtos = [];

async function carregarProdutos(){
    const response = await fetch(urlApi);
    const data = await response.json();
    produtos = data.slice(0,20);
    renderizarCards(produtos);

    function renderizarCards(lista) {
    const container = document.getElementById('grid-produtos');
    container.innerHTML = "";

    produtos.forEach(produtoData => {
        const produto = new ProdutoModel(produtoData);
        console.log(produto);

        let precoOriginalHtml = '';

        // 2. Verificamos se o preço original é maior que 0.
        if (produto.precoOriginal > 0) {
            // Se for, a variável recebe a linha de HTML que você já usava.
            precoOriginalHtml = `<p id="preco-original" class="card-text">Preco Original: ${produto.precoOriginal}</p>`;
        }

        const card = `
            <div class="col card-produto">
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
        `
        container.innerHTML += card;
    })
    }
}

function pesquisarProdutos() {
    const termo = document.getElementById('btn-pesquisa').value.toLowerCase();
    const filtrados = produtos.filter(p => p.titulo.toLowerCase().includes(termo));
    renderizarCards(filtrados);
}

carregarProdutos();
