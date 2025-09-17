package com.affiliate.Projeto.Afiliados.Repository;

import com.affiliate.Projeto.Afiliados.Model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query; // Importação necessária
import org.springframework.stereotype.Repository;

import java.util.List; // Importação necessária

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long>, JpaSpecificationExecutor<Produto> {

    // Novo método para buscar todas as categorias distintas
    @Query("SELECT DISTINCT p.categoria FROM Produto p WHERE p.categoria IS NOT NULL AND p.categoria != '' ORDER BY p.categoria")
    List<String> findDistinctCategorias();

    // Novo método para buscar todas as plataformas (marketplaces) distintas
    @Query("SELECT DISTINCT p.plataforma FROM Produto p WHERE p.plataforma IS NOT NULL AND p.plataforma != '' ORDER BY p.plataforma")
    List<String> findDistinctPlataformas();
}