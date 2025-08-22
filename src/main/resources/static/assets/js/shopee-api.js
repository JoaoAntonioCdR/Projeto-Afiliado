
export function isShopeeUrl(raw) {
    try {
        const u = new URL(raw);
        return /shopee\./i.test(u.hostname) || /s\.shopee\./i.test(u.hostname);
    } catch {
        return false;
    }
}

export function parseShopeeIds(raw) {
    try {
        const u = new URL(raw);
        const path = decodeURIComponent(u.pathname);

        // padrão 1: /product/68475578/27971600849
        let m = path.match(/\/product\/(\d+)\/(\d+)/);
        if (m) return { shopId: m[1], itemId: m[2] };

        // padrão 2: ...-i.{shopId}.{itemId}
        m = path.match(/-i\.(\d+)\.(\d+)/);
        if (m) return { shopId: m[1], itemId: m[2] };

        return { shopId: null, itemId: null };
    } catch {
        return { shopId: null, itemId: null };
    }
}

const PRODUCT_OFFER_QUERY = `
  query ProductOffer($shopId: Long, $itemId: Long, $limit: Int) {
    productOfferV2(shopId: $shopId, itemId: $itemId, limit: $limit) {
      nodes {
        title
        price
        image
        productLink
        offerLink   # costuma vir já com tracking de afiliado
        commissionRate
      }
    }
  }
`;

async function callShopeeGraphQLThroughBackend({ query, variables = {} }) {
    const resp = await fetch('/api/shopee/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Erro ao chamar Shopee via backend: ${resp.status} ${text}`);
    }
    const data = await resp.json();
    if (data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(data.errors)}`);
    }
    return data.data;
}

export async function fetchShopeeProductAndAffiliateLink(rawUrl, { preferApi = true, affiliateId = null, subIds = [] } = {}) {
    if (!isShopeeUrl(rawUrl)) throw new Error('URL não parece da Shopee.');

    // 1) tenta extrair ids
    const { shopId, itemId } = parseShopeeIds(rawUrl);

    // 2) se quiser usar API (recomendado), chama via backend (que assina):
    if (preferApi && (shopId || itemId)) {
        try {
            const data = await callShopeeGraphQLThroughBackend({
                query: PRODUCT_OFFER_QUERY,
                variables: { shopId: shopId ? Number(shopId) : null, itemId: itemId ? Number(itemId) : null, limit: 1 }
            });
            const node = data?.productOfferV2?.nodes?.[0];
            if (node) {
                return {
                    source: 'shopee',
                    originalUrl: rawUrl,
                    title: node.title,
                    price: node.price,
                    image: node.image,
                    affiliateUrl: node.offerLink || node.productLink, // fallback
                    commissionRate: node.commissionRate
                };
            }
        } catch (e) {
            console.warn('Falhou ao usar GraphQL da Shopee, tentando fallback de redirect...', e);
            // cai para o fallback abaixo
        }
    }

    // 3) fallback sem API: gerar link de afiliado de redirect (precisa do seu affiliate_id)
    if (!affiliateId) {
        throw new Error('Sem API e sem affiliateId: informe affiliateId para gerar o link de redirect.');
    }
    const affiliateUrl = buildAffiliateRedirect(rawUrl, affiliateId, subIds);
    return {
        source: 'shopee',
        originalUrl: rawUrl,
        title: null,
        price: null,
        image: null,
        affiliateUrl,
        commissionRate: null
    };
}

export async function saveProductToBackend(product) {
    // ajuste a rota conforme seu controller (/api/afiliados ou similar)
    const resp = await fetch('/api/afiliados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    if (!resp.ok) throw new Error('Erro ao salvar produto no seu backend.');
    return resp.json();
}