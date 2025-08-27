document.addEventListener('DOMContentLoaded', () => {
    const linkForm = document.getElementById('link-form');
    // Garante que o script só execute se o formulário existir na página
    if (!linkForm) return;

    const urlInput = document.getElementById('url-produto');
    const feedbackArea = document.getElementById('feedback-area');
    const submitButton = linkForm.querySelector('button[type="submit"]');

    linkForm.addEventListener('submit', async (event) => {
        // Impede o comportamento padrão do formulário (recarregar a página)
        event.preventDefault();

        const url = urlInput.value;

        // Feedback visual para o usuário
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        feedbackArea.innerHTML = '';
        feedbackArea.className = 'feedback'; // Reseta as classes de cor

        try {
            // O endpoint /n8n já existe no seu N8nController
            const response = await fetch('/n8n', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Monta o corpo da requisição exatamente como você pediu
                body: JSON.stringify({ link: url }),
            });

            if (!response.ok) {
                // Captura erros da API (ex: 500 Internal Server Error)
                const errorText = await response.text();
                throw new Error(`Erro do servidor: ${response.status} - ${errorText}`);
            }

            const result = await response.text();
            console.log('Resposta do n8n:', result);

            // Mostra mensagem de sucesso
            feedbackArea.className = 'feedback success';
            feedbackArea.textContent = 'Link enviado com sucesso para processamento!';
            urlInput.value = ''; // Limpa o campo do formulário

        } catch (error) {
            console.error('Falha ao enviar o link:', error);
            // Mostra mensagem de erro
            feedbackArea.className = 'feedback error';
            feedbackArea.textContent = `Falha ao enviar o link. Detalhes: ${error.message}`;
        } finally {
            // Este bloco SEMPRE executa, reabilitando o botão
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar para n8n';
        }
    });
});