package com.affiliate.Projeto.Afiliados.Configuration;

import com.affiliate.Projeto.Afiliados.Model.Usuario;
import com.affiliate.Projeto.Afiliados.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Verifica se já existe algum usuário no banco. Se não, cria o admin.
        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            // MUDE ESTE NOME DE USUÁRIO E SENHA PARA ALGO SEGURO
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("Pompeu123@")); // A senha é criptografada aqui
            admin.setRoles("ROLE_ADMIN");

            usuarioRepository.save(admin);
            System.out.println(">>> Usuário 'admin' criado com sucesso!");
        }
    }
}