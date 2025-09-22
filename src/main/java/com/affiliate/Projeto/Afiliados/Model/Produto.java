package com.affiliate.Projeto.Afiliados.Model;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
public class Produto {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private BigDecimal precoOriginal;
    private BigDecimal precoAVista;
    private String parcelamento;
    private String categoria;
    private String imagemUrl;
    private String plataforma;
    private String descricao;

    @Column(unique = true, nullable = false)
    private String linkAfiliado;

    public Produto() {
    }

    public Produto(String titulo, BigDecimal precoOriginal, BigDecimal precoAVista, String categoria, String parcelamento,String plataforma, String linkAfiliado, String imagemUrl, String descricao) {
        this.titulo = titulo;
        this.precoOriginal = precoOriginal;
        this.precoAVista = precoAVista;
        this.parcelamento = parcelamento;
        this.plataforma = plataforma;
        this.categoria = categoria;
        this.linkAfiliado = linkAfiliado;
        this.imagemUrl = imagemUrl;
        this.descricao = descricao;
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

    public String getCategoria() {
        return categoria;
    }

    public String getParcelamento() {
        return parcelamento;
    }

    public void setParcelamento(String parcelamento) {
        this.parcelamento = parcelamento;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
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

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
