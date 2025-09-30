package com.affiliate.Projeto.Afiliados.Configuration;

import com.affiliate.Projeto.Afiliados.Repository.UsuarioRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Exige que o usuário tenha a role "ADMIN" para acessar /admin.html
                        .requestMatchers("/admin.html").hasRole("ADMIN")
                        // Permite acesso a todas as outras URLs sem autenticação
                        .anyRequest().permitAll()
                )
                .formLogin(form -> form
                        // O Spring gera uma página de login padrão em /login
                        // Redireciona para /admin.html após o login bem-sucedido
                        .defaultSuccessUrl("/admin.html", true)
                        .permitAll()
                )
                .logout(logout -> logout
                        // Permite que qualquer um acesse a URL de logout
                        .logoutSuccessUrl("/")
                        .permitAll()
                );
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService(UsuarioRepository usuarioRepository) {
        // Este método ensina o Spring Security a carregar os detalhes do usuário do seu banco de dados
        return username -> usuarioRepository.findByUsername(username)
                .map(usuario -> User.withUsername(usuario.getUsername())
                        .password(usuario.getPassword())
                        .roles("ADMIN") // Define a role do usuário. Pode ser extraído do banco se tiver mais roles.
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + username));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Define o BCrypt como o algoritmo para criptografar senhas. É o padrão e mais seguro.
        return new BCryptPasswordEncoder();
    }
}