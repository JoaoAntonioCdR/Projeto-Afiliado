// index.js (Versão com Express.js)
import express from 'express';
import axios from 'axios';
import puppeteer from 'puppeteer-core';
// Esta é a forma correta de importar o 'fs/promises'
import fs from 'fs/promises';
// --- Configuração Global ---
const API_TOKEN = process.env.GOLOGIN_API_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const API_BASE_URL = 'https://api.gologin.com';

// --- Configuração do Express ---
const app = express(); // NOVO
app.use(express.json()); // NOVO - Para ler o req.body
const PORT = process.env.PORT || 3000;

// --- Funções da API GoLogin (Etapas 1, 2, 5) ---
// (As funções createProfile, injectCookies, deleteProfile permanecem idênticas ao seu script)

async function createProfile() {
    console.log('Criando perfil GoLogin...');
    try {
        const response = await axios.post(
            `${API_BASE_URL}/browser/custom`,
            { name: `shopee-scraper-profile-${Date.now()}`, os: 'win' },
            { headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' } }
        );
        const profileId = response.data.id;
        console.log(`Perfil criado com sucesso. ID: ${profileId}`);
        return profileId;
    } catch (error) {
        console.error('Erro ao criar perfil:', error.response?.data || error.message);
        throw new Error('Falha na criação do perfil GoLogin.');
    }
}

async function injectCookies(profileId, cookiesJsonPath) {
    console.log(`Injetando cookies no perfil ${profileId} a partir de ${cookiesJsonPath}...`);
    try {
        const cookiesData = await fs.readFile(cookiesJsonPath, 'utf-8');
        const cookiesArray = JSON.parse(cookiesData);
        if (!Array.isArray(cookiesArray)) {
            throw new Error('O arquivo de cookies não está formatado como um array JSON.');
        }
        await axios.post(
            `${API_BASE_URL}/browser/${profileId}/cookies`,
            cookiesArray,
            { headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' } }
        );
        console.log('Cookies injetados com sucesso.');
    } catch (error) {
        console.error('Erro ao injetar cookies:', error.response?.data || error.message);
        throw new Error('Falha na injeção de cookies.');
    }
}

async function deleteProfile(profileId) {
    if (!profileId) {
        console.warn('ID do perfil não fornecido, pulando exclusão.');
        return;
    }
    console.log(`Excluindo perfil ${profileId}...`);
    try {
        await axios.delete(
            `${API_BASE_URL}/browser`,
            {
                headers: { Authorization: `Bearer ${API_TOKEN}`, 'Content-Type': 'application/json' },
                data: { profilesToDelete: [profileId] },
            }
        );
        console.log('Perfil excluído com sucesso.');
    } catch (error) {
        console.error('Erro ao excluir perfil:', error.response?.data || error.message);
    }
}

// --- Funções de Automação (Etapas 3, 4) ---
// (As funções connectToCloudBrowser, sendToWebhook, runScraper permanecem idênticas ao seu script)

async function connectToCloudBrowser(profileId) {
    console.log(`Conectando ao navegador na nuvem para o perfil ${profileId}...`);
    const cloudBrowserUrl = `https://cloudbrowser.gologin.com/connect?token=${API_TOKEN}&profile=${profileId}`;
    try {
        const browser = await puppeteer.connect({
            browserWSEndpoint: cloudBrowserUrl,
            defaultViewport: null,
        });
        console.log('Conectado ao navegador na nuvem.');
        return browser;
    } catch (error) {
        console.error('Erro ao conectar ao WebSocket do GoLogin Cloud:', error.message);
        throw new Error('Falha na conexão com o navegador da nuvem.');
    }
}

async function sendToWebhook(data) {
    console.log('Enviando dados para o webhook n8n...');
    try {
        const response = await axios.post(N8N_WEBHOOK_URL, data);
        console.log('Webhook n8n respondeu com sucesso.');
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar para o webhook n8n:', error.response?.data || error.message);
        throw new Error('Falha no webhook n8n.');
    }
}

async function runScraper(browser, productUrl) {
    console.log(`Iniciando scraping para: ${productUrl}`);
    const page = await browser.newPage();

    const apiDataPromise = new Promise((resolve, reject) => {
        page.on('response', async (response) => {
            // ATUALIZE ESTA URL para a API da Shopee que você deseja interceptar
            if (response.url().includes('api/v4/pdp/get_pc')) {
                try {
                    console.log(`API interceptada: ${response.url()}`);
                    const data = await response.json();
                    resolve(data);
                } catch (e) {
                    reject(new Error('Falha ao processar JSON da API interceptada.'));
                }
            }
        });
    });

    await page.goto(productUrl, { waitUntil: 'networkidle2' });
    const interceptedData = await apiDataPromise;
    const dataToSend = {
        interceptedData: interceptedData.data,
        shopeeProductUrl: productUrl,
    }

    if (interceptedData) {
        await sendToWebhook(dataToSend);
        console.log('Scraping e envio para n8n concluídos.');
    } else {
        throw new Error('Não foi possível interceptar os dados da API (timeout ou URL incorreta).');
    }

    await page.close();
}

// --- Bloco de Execução Principal (Servidor Express) ---

app.post('/scrape-shopee', async (req, res) => {
    const { url: productUrl } = req.body; // Pega a URL do body
    const COOKIES_PATH = './cookies.json'; // Caminho dos cookies, conforme seu script

    if (!productUrl) {
        return res.status(400).json({ error: 'A URL do produto é obrigatória no body.' });
    }

    if (!API_TOKEN ||!N8N_WEBHOOK_URL) {
        console.error('Erro: GOLOGIN_API_TOKEN ou N8N_WEBHOOK_URL não definidos.');
        return res.status(500).json({ error: 'Variáveis de ambiente não configuradas no servidor.' });
    }

    let profileId = null;
    let browser = null;
    console.log(`Iniciando scrape para: ${productUrl}`);

    try {
        // Etapa 1: Criar
        profileId = await createProfile();

        // Etapa 2: Injetar Cookies
        await injectCookies(profileId, COOKIES_PATH);

        // Etapa 3: Conectar
        browser = await connectToCloudBrowser(profileId);

        // Etapa 4: Scrape e Webhook
        await runScraper(browser, productUrl); // Passa a URL do body

        // Resposta de sucesso
        res.status(200).json({ success: true, message: 'Scrape concluído e dados enviados ao webhook.' });

    } catch (error) {
        console.error('Falha no fluxo principal do scraper:', error.message);
        res.status(500).json({ success: false, error: error.message });

    } finally {
        // Limpeza
        if (browser) {
            console.log('Fechando conexão do navegador...');
            await browser.close();
        }
        // Etapa 5: Excluir (sempre executa)
        await deleteProfile(profileId);
        console.log('Fluxo concluído.');
    }
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor scraper rodando na porta ${PORT}`);
    console.log(`Para iniciar, envie um POST para http://localhost:${PORT}/scrape-shopee com { "url": "..." } no body.`);
});