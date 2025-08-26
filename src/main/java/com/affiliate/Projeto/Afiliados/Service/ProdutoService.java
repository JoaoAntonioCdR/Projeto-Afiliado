package com.affiliate.Projeto.Afiliados.Service;

import com.affiliate.Projeto.Afiliados.Model.Produto;
import com.affiliate.Projeto.Afiliados.Repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto save(Produto produto) {
        return produtoRepository.save(produto);
    }

    // MÉTODO ANTIGO (pode remover ou manter para uso interno)
    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }

    // NOVO MÉTODO PARA PAGINAÇÃO
    public Page<Produto> findAll(Pageable pageable) {
        return produtoRepository.findAll(pageable);
    }
}