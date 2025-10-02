// Seleciona os elementos da interface uma única vez para reutilizá-los
const pesquisaInput = document.getElementById('pesquisaInput');
const resultsCard = document.getElementById('results-card');
const uiElements = {
    mealTitle: document.getElementById('Meal'),
    mealThumb: document.getElementById('MealThumb'),
    instructionsTitle: document.getElementById('instructions-title'),
    category: document.getElementById('Category'),
    area: document.getElementById('Area'),
    tags: document.getElementById('Tags'),
    instructions: document.getElementById('Instructions'),
};

// Função para atualizar a interface com os dados da refeição
function updateUI(meal, foodQuery) {
    if (meal) {
        uiElements.mealTitle.textContent = meal.strMeal;
        uiElements.category.textContent = meal.strCategory || '';
        uiElements.area.textContent = meal.strArea || '';
        uiElements.tags.textContent = meal.strTags || 'Nenhuma';
        uiElements.instructions.textContent = meal.strInstructions || '';
        uiElements.mealThumb.src = meal.strMealThumb;
        uiElements.mealThumb.style.display = 'block';
        uiElements.instructionsTitle.style.display = 'block';
    } else {
        uiElements.mealTitle.textContent = `Nenhuma refeição encontrada para "${foodQuery}"`;
    }
}

// Função para limpar e preparar a interface para uma nova busca
function resetUI() {
    resultsCard.style.display = 'block';
    uiElements.mealTitle.textContent = 'A carregar...';
    uiElements.mealThumb.style.display = 'none';
    uiElements.instructionsTitle.style.display = 'none';
    Object.values(uiElements).forEach(el => {
        if (el.id !== 'Meal' && el.tagName !== 'IMG') {
            el.textContent = '';
        }
    });
}

async function searchMeal() {
    const food = pesquisaInput.value.trim();
    if (!food) {
        alert("Por favor, digite o nome de uma refeição.");
        return;
    }

    resetUI();

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`);
        const data = await response.json();
        updateUI(data.meals ? data.meals[0] : null, food);
    } catch (error) {
        console.error('Erro na requisição:', error);
        uiElements.mealTitle.textContent = "Ocorreu um erro ao buscar os dados.";
    }
}

async function getStream(type) {
    if (!navigator.mediaDevices?.getUserMedia) {
        alert('A API de multimídia do utilizador não é suportada no seu navegador.');
        return;
    }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ [type]: true });
        const video = document.querySelector('video');
        video.srcObject = stream;
        video.play();
    } catch (err) {
        alert('Erro ao aceder à câmera: ' + err.message);
        console.error('Erro na câmera: ', err);
    }
}

function takePhoto() {
    const video = document.querySelector('video');
    const gallery = document.getElementById('photo-gallery');
    const galleryTitle = document.getElementById('gallery-title');

    if (!video.srcObject || !video.srcObject.active) {
        alert('A câmera não está ativa. Por favor, ligue a câmera primeiro.');
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.alt = "Foto capturada";
    
    gallery.appendChild(img);
    galleryTitle.style.display = 'block';
}

pesquisaInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchMeal();
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker registrado:', reg))
            .catch(err => console.log('Falha ao registrar Service Worker:', err));
    });
}