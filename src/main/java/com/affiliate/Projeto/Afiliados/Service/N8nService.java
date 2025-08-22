package com.affiliate.Projeto.Afiliados.Service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashMap;
import java.util.Map;

@Service
public class N8nService {

    private static final String API_URL = "http://localhost:5678/webhook-test/00e35d6b-1a47-4b70-8c6c-f590a4cd4218"; // trocar pelo endpoint real

    public String enviarLinkParaN8n(String link) {
        // Montando Body da Requisição
        Map<String ,String> body = new HashMap<>();
        body.put("link", link);

        ObjectMapper mapper = new ObjectMapper();
        String payloadJson;
        try{
            payloadJson = mapper.writeValueAsString(body);
        } catch (Exception e){
            e.printStackTrace();
            return "Erro ao converter para JSON";
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Montar requisição
        HttpEntity<String> entity = new HttpEntity<>(payloadJson, headers);

        // Fazer requisição POST
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(API_URL, HttpMethod.POST, entity, String.class);

        // Imprimir resposta
        System.out.println(response.getStatusCode());
        System.out.println(response.getBody());

        return response.getBody();
    }
}
