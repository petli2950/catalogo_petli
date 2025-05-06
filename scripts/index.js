const RANGE_LOGO = 'Página2!A1:B'; // Planilha de Informações (Logo)
const RANGE_PRODUCTS = 'Página1!A2:C'; // Planilha de Produtos para o catálogo

const API_KEY = 'AIzaSyCDh0IRBzl2NL0Gc84qceyTHZXlS5M5bek';
const SHEET_ID = '1RBJCnXHT6JUCSBHi_TQtNaSISwrGOyKoihILpQ-FSjM';

async function fetchProdutos() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE_PRODUCTS}?key=${API_KEY}`;
    // https://sheets.googleapis.com/v4/spreadsheets/1RBJCnXHT6JUCSBHi_TQtNaSISwrGOyKoihILpQ-FSjM/values/Página1!A2:C?key=AIzaSyCDh0IRBzl2NL0Gc84qceyTHZXlS5M5bek

    try {
        const response = await fetch(url);
        const data = await response.json();
        const products = data.values || [];

        renderProdutos(products);
    } catch (error) {
        document.getElementById('product-grid').innerText = 'Erro ao carregar produtos';
        console.error(error);
    }
}

function renderProdutos(products) {
    const container = document.getElementById('product-grid');
    container.innerHTML = '';

    /**
     * Para cada produto retornado da API:
     *  - Cria uma div com a classe `product-card`
     *  - Insere a imagem do produto
     *  - Adiciona as informações do produto
     */
    products.forEach(([name, price, image_link]) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${image_link}" alt="${name}" />
            <div class="product-info">
                <div class="product-name">${name}</div>
                <div class="product-price">${price}</div>
            </div>
        `;
        container.appendChild(card);
    });
}
/**
 * Busca os produtos para o catálogo
 */
fetchProdutos();

/**
 * Botão Flutuante do WhatsApp
 */
document.addEventListener("DOMContentLoaded", function () {
    var whatsappButton = document.getElementById("whatsapp-button");

    setTimeout(function () {
        whatsappButton.style.display = "block";
        whatsappButton.classList.add("fade-in");

        setInterval(function () {
            whatsappButton.classList.toggle("jump");
        }, 2000);

    }, 3000);
});


async function fetchLogo() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE_LOGO}?key=${API_KEY}`;
    // https://sheets.googleapis.com/v4/spreadsheets/1RBJCnXHT6JUCSBHi_TQtNaSISwrGOyKoihILpQ-FSjM/values/Página2!A1?key=AIzaSyCDh0IRBzl2NL0Gc84qceyTHZXlS5M5bek

    try {
        const response = await fetch(url);
        const dataJson = await response.json();
        const companyData = dataJson.values || [];

        /**
         * Irá trabalhar em cima de cada dado da empresa
         */
        companyData.forEach(([name, content]) => {
            switch (name) {
                case 'Logo':
                    const imageLogo = document.getElementById('image-logo');
                    imageLogo.src = content; // Link da imagem
                    break

                case 'Whatsapp':
                    if (!!content) {
                        const whatsappButton = document.getElementById('whatsapp-button');

                        const whatsappNumber = document.getElementById('whatsapp-number');
                        whatsappNumber.href = `https://wa.me/55${content}`; // Número do WhatsApp

                        whatsappNumber.classList.remove('disabled');
                        whatsappButton.classList.remove('disabled');
                        whatsappButton.classList.add('whatsapp-button');
                    }
                    break
            }

        });

    } catch (error) {
        console.error(error);
    }
}
fetchLogo();