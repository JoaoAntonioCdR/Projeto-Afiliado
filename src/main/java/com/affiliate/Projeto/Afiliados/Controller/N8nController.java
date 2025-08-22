package com.affiliate.Projeto.Afiliados.Controller;

import com.affiliate.Projeto.Afiliados.Model.LinkRequest;
import com.affiliate.Projeto.Afiliados.Service.N8nService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/n8n")
public class N8nController {

    @Autowired
    private N8nService n8nService;

    @PostMapping()
    public ResponseEntity<String> enviarLink(@RequestBody LinkRequest request) throws Exception {
        return ResponseEntity.ok(n8nService.enviarLinkParaN8n(request.getLink()));
    }
}
