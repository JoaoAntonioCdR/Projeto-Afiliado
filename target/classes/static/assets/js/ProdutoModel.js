class ProdutoModel {
    constructor(apiData) {
        this.id = apiData.id;
        this.titulo = apiData.titulo;
        this.precoOriginal = apiData.precoOriginal;
        this.precoAVista = apiData.precoAVista;
        this.parcelamentoPreco = apiData.parcelamentoPreco;
        this.parcelamentoTexto = apiData.parcelamentoTexto;
        this.plataforma = apiData.plataforma;
        this.imagemUrl = apiData.imagemUrl;
        this.linkAfiliado = apiData.linkAfiliado;
    }
}