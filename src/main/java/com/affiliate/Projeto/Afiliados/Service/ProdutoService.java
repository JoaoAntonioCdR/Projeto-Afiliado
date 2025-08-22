package com.affiliate.Projeto.Afiliados.Service;

import com.affiliate.Projeto.Afiliados.Model.DTO.ProdutoDTO;
import com.affiliate.Projeto.Afiliados.Model.Produto;
import com.affiliate.Projeto.Afiliados.Repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public Produto save(Produto produto) {
        return produtoRepository.save(produto);
    }

    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }
}
