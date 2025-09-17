package com.affiliate.Projeto.Afiliados.Service;

import com.affiliate.Projeto.Afiliados.Model.Produto;
import com.affiliate.Projeto.Afiliados.Repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import jakarta.persistence.criteria.Predicate;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    // ... outros métodos save() e findAll() ...
    public Produto save(Produto produto) {
        return produtoRepository.save(produto);
    }
    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }


    // MÉTODO DE BUSCA ATUALIZADO COM FILTROS E TERMO DE BUSCA
    public Page<Produto> findWithFilters(String categoria, String plataforma, String searchTerm, Pageable pageable) {
        return produtoRepository.findAll((Specification<Produto>) (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (categoria != null && !categoria.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("categoria"), categoria));
            }

            if (plataforma != null && !plataforma.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("plataforma"), plataforma));
            }

            // NOVO: Se um termo de busca foi enviado, adiciona um filtro "LIKE" no título
            if (searchTerm != null && !searchTerm.isEmpty()) {
                // Usamos lower para fazer a busca ser case-insensitive (não diferencia maiúsculas de minúsculas)
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("titulo")), "%" + searchTerm.toLowerCase() + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        }, pageable);
    }

    // ... métodos findDistinctCategorias() e findDistinctPlataformas() ...
    public List<String> findDistinctCategorias() {
        return produtoRepository.findDistinctCategorias();
    }
    public List<String> findDistinctPlataformas() {
        return produtoRepository.findDistinctPlataformas();
    }
}