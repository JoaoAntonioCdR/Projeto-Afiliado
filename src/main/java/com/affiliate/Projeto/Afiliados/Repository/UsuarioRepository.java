package com.affiliate.Projeto.Afiliados.Repository;

import com.affiliate.Projeto.Afiliados.Model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Método para buscar um usuário pelo nome de usuário
    Optional<Usuario> findByUsername(String username);
}