package com.affiliate.Projeto.Afiliados.Model.DTO;

import java.math.BigDecimal;

public class ProdutoDTO {

    private String titulo;
    private BigDecimal precoOriginal;
    private BigDecimal precoAVista;
    private String parcelamento;
    private String imagemUrl;
    private String linkAfiliado;

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public BigDecimal getPrecoOriginal() {
        return precoOriginal;
    }

    public void setPrecoOriginal(BigDecimal precoOriginal) {
        this.precoOriginal = precoOriginal;
    }

    public String getParcelamento() {
        return parcelamento;
    }

    public void setParcelamento(String parcelamento) {
        this.parcelamento = parcelamento;
    }

    public BigDecimal getPrecoAVista() {
        return precoAVista;
    }

    public void setPrecoAVista(BigDecimal precoAVista) {
        this.precoAVista = precoAVista;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public String getLinkAfiliado() {
        return linkAfiliado;
    }

    public void setLinkAfiliado(String linkAfiliado) {
        this.linkAfiliado = linkAfiliado;
    }
}
