package com.affiliate.Projeto.Afiliados.Model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "produto")
public class Produto {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private BigDecimal precoOriginal;
    private BigDecimal precoAVista;
    private BigDecimal parcelamentoPreco;
    private String parcelamentoTexto;
    private String categoria;
    private String imagemUrl;
    private String plataforma;

    @Column(unique = true, nullable = false)
    private String linkAfiliado;

    public Produto() {
    }

    public Produto(String titulo, BigDecimal precoOriginal, BigDecimal precoAVista, BigDecimal parcelamentoPreco, String categoria, String parcelamentoTexto,String plataforma, String linkAfiliado, String imagemUrl) {
        this.titulo = titulo;
        this.precoOriginal = precoOriginal;
        this.precoAVista = precoAVista;
        this.parcelamentoPreco = parcelamentoPreco;
        this.parcelamentoTexto = parcelamentoTexto;
        this.plataforma = plataforma;
        this.categoria = categoria;
        this.linkAfiliado = linkAfiliado;
        this.imagemUrl = imagemUrl;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getPrecoOriginal() {
        return precoOriginal;
    }

    public void setPrecoOriginal(BigDecimal precoOriginal) {
        this.precoOriginal = precoOriginal;
    }

    public BigDecimal getPrecoAVista() {
        return precoAVista;
    }

    public void setPrecoAVista(BigDecimal precoAVista) {
        this.precoAVista = precoAVista;
    }

    public String getParcelamentoTexto() {
        return parcelamentoTexto;
    }

    public void setParcelamentoTexto(String parcelamentoTexto) {
        this.parcelamentoTexto = parcelamentoTexto;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public BigDecimal getParcelamentoPreco() {
        return parcelamentoPreco;
    }

    public void setParcelamentoPreco(BigDecimal parcelamentoPreco) {
        this.parcelamentoPreco = parcelamentoPreco;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public String getPlataforma() {
        return plataforma;
    }

    public void setPlataforma(String plataforma) {
        this.plataforma = plataforma;
    }

    public String getLinkAfiliado() {
        return linkAfiliado;
    }

    public void setLinkAfiliado(String linkAfiliado) {
        this.linkAfiliado = linkAfiliado;
    }
}
