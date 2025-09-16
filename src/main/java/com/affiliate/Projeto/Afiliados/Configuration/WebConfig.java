package com.affiliate.Projeto.Afiliados.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Use .allowedOrigins para domínios exatos
                .allowedOrigins(
                        // Adicione as versões HTTP e HTTPS do seu site principal
                        "http://www.ofertasdocoelho.com",
                        "https://www.ofertasdocoelho.com",
                        "http://ofertasdocoelho.com",
                        "https://ofertasdocoelho.com",

                        // Adicione as URLs públicas dos outros serviços, se eles tiverem frontends
                        "http://n8n.ofertadocoelho.com",
                        "https://n8n.ofertadocoelho.com",
                        "http://waha.ofertasdocoelho.com",
                        "https://waha.ofertasdocoelho.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
