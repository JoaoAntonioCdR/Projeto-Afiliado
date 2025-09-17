package com.affiliate.Projeto.Afiliados.Controller;

import com.affiliate.Projeto.Afiliados.Model.DTO.ProdutoDTO;
import com.affiliate.Projeto.Afiliados.Model.Produto;
import com.affiliate.Projeto.Afiliados.Service.ProdutoService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    // ENDPOINT ATUALIZADO PARA ACEITAR O TERMO DE BUSCA
    @GetMapping
    public Page<Produto> findWithFilters(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String plataforma,
            @RequestParam(required = false) String searchTerm // NOVO: Parâmetro opcional para busca
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return produtoService.findWithFilters(categoria, plataforma, searchTerm, pageable);
    }

    // ... outros endpoints (/all, POST, /categorias, /plataformas) ...
    @GetMapping("/all")
    public List<Produto> findAll() {
        return produtoService.findAll();
    }

    @PostMapping
    public Produto save(@RequestBody ProdutoDTO dto) {
        ModelMapper mapper = new ModelMapper();
        Produto produto = mapper.map(dto, Produto.class);
        return produtoService.save(produto);
    }

    @GetMapping("/categorias")
    public List<String> getCategorias() {
        return produtoService.findDistinctCategorias();
    }

    @GetMapping("/plataformas")
    public List<String> getPlataformas() {
        return produtoService.findDistinctPlataformas();
    }
}