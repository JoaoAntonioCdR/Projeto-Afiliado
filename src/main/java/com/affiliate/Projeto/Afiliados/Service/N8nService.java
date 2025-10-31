package com.affiliate.Projeto.Afiliados.Service;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class N8nService {

    @Value("${N8N_WEBHOOK_URL}")
    private String apiUrl;

    // ADICIONADO: Injeta o nome do header do arquivo de configuração
    @Value("${N8N_HEADER_NAME}")
    private String n8nHeaderName;

    // ADICIONADO: Injeta o valor do segredo do arquivo de configuração
    @Value("${N8N_SECRET_VALUE}")
    private String n8nSecretValue;

    public String enviarLinkParaN8n(String link) {
        // Montando Body da Requisição
        Map<String, String> body = new HashMap<>();
        body.put("link", link);

        // Montando os Headers da Requisição
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // --- AQUI ESTÁ A MUDANÇA PRINCIPAL ---
        // ADICIONADO: Define o header de autenticação com os valores injetados
        headers.set(n8nHeaderName, n8nSecretValue);

        // Montar requisição
        // O RestTemplate converte o Map 'body' para JSON automaticamente.
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        // Fazer requisição POST
        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);

            // Imprimir resposta para depuração
            System.out.println("Status da Resposta: " + response.getStatusCode());
            System.out.println("Corpo da Resposta: " + response.getBody());

            return response.getBody();

        } catch (HttpClientErrorException e) {
            // Este erro é útil para ver falhas de autenticação (401)
            System.err.println("Erro na requisição para o n8n: " + e.getStatusCode());
            System.err.println("Corpo do Erro: " + e.getResponseBodyAsString());
            return "Erro ao se comunicar com o n8n: " + e.getStatusCode();
        }
    }
    public String enviarDadosParaN8n(Map<String, Object> data) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set(n8nHeaderName, n8nSecretValue);

        // Converte o Map de dados para uma String JSON
        Gson gson = new Gson();
        String jsonBody = gson.toJson(data);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        RestTemplate restTemplate = new RestTemplate();

        try {
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);
            System.out.println("Dados enviados para o n8n com sucesso. Status: " + response.getStatusCode());
            return response.getBody();
        } catch (HttpClientErrorException e) {
            System.err.println("Erro na requisição para o n8n: " + e.getStatusCode());
            System.err.println("Corpo do Erro: " + e.getResponseBodyAsString());
            return "Erro ao se comunicar com o n8n: " + e.getStatusCode();
        }
    }
}