package com.affiliate.Projeto.Afiliados.Controller;

import com.affiliate.Projeto.Afiliados.Model.DTO.ProdutoDTO;
import com.affiliate.Projeto.Afiliados.Model.Produto;
import com.affiliate.Projeto.Afiliados.Service.ProdutoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5678")
@RestController
@RequestMapping("/api")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public List<Produto> findAll() {
        return produtoService.findAll();
    }

    @PostMapping
    public Produto save(@RequestBody ProdutoDTO dto) {
        ModelMapper mapper = new ModelMapper();
        Produto produto = mapper.map(dto, Produto.class);
        return produtoService.save(produto);
    }
}
