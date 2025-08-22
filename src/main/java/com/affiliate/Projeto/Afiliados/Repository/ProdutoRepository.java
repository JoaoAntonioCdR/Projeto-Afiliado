package com.affiliate.Projeto.Afiliados.Repository;

import com.affiliate.Projeto.Afiliados.Model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
