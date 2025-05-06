const senhaCorreta = "admin123"; // <- Altere a senha aqui

const cloudName = 'dqhc0gy9d';
const uploadPreset = 'ml_default';

window.onload = function () {
    const senha = prompt("Digite a senha para acessar:");
    if (senha !== senhaCorreta) {
        alert("Acesso negado.");
        window.location.href = "../index.html";
    }
};

document.getElementById('uploadButton').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const customNameInput = document.getElementById('customName');
    const uploadButton = document.getElementById('uploadButton');
    const messageEl = document.getElementById('message');
    const file = fileInput.files[0];
    const customName = customNameInput.value.trim();

    messageEl.textContent = '';
    uploadButton.disabled = true;
    uploadButton.textContent = 'Enviando...';

    if (!file) {
        messageEl.textContent = 'Selecione um arquivo.';
        uploadButton.disabled = false;
        uploadButton.textContent = 'Enviar Imagem';
        return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (customName) {
        const extension = file.name.split('.').pop();
        formData.append('public_id', customName + "." + extension);
    }

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const popup = document.getElementById('popup');
        const popupText = document.getElementById('popupText');
        const copyButton = document.getElementById('copyButton');

        popupText.textContent = `URL da imagem: ${data.secure_url}`;
        popup.style.display = 'block';

        copyButton.onclick = () => {
            navigator.clipboard.writeText(data.secure_url).then(() => {
                popup.style.display = 'none';
                alert('Link copiado para a área de transferência!');
            });
        };

    } catch (err) {
        messageEl.textContent = 'Erro ao enviar imagem: ' + err.message;
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = 'Enviar Imagem';
    }
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
            if (name === 'Logo') {
                const container = document.getElementById('image-logo');
                container.src = content; // Link da imagem
            }
        });

    } catch (error) {
        console.error(error);
    }
}
fetchLogo();