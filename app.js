document.addEventListener('DOMContentLoaded', () => {
    // Configurações
    const OPENWEATHER_API_KEY = 'f0584325ffbd6dbc75dcccf7368159f3';
    const OPENTRIPMAP_API_KEY = '5ae2e3f221c38a28845f05b6e1e72f6e';
    const WIKIPEDIA_API_URL = 'https://pt.wikipedia.org/w/api.php';
    const IBGE_API_URL = 'https://servicodados.ibge.gov.br/api/v1/localidades';
    const UNSPLASH_API_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Substitua pela sua chave
    const FOURSQUARE_API_KEY = 'YOUR_FOURSQUARE_KEY'; // Substitua pela sua chave
    
    // Elementos do DOM
    const elements = {
        countrySelect: document.getElementById('country-select'),
        stateSelect: document.getElementById('state-select'),
        citySelect: document.getElementById('city-select'),
        durationInput: document.getElementById('duration'),
        generateBtn: document.getElementById('generate-roteiro-btn'),
        roteiroOutput: document.getElementById('roteiro-output'),
        roteiroContainer: document.getElementById('roteiro-container'),
        roteiroCityName: document.getElementById('roteiro-city-name'),
        roteiroDuration: document.getElementById('roteiro-duration'),
        roteiroSeason: document.getElementById('roteiro-season'),
        roteiroState: document.getElementById('roteiro-state'),
        roteiroCityDescription: document.getElementById('roteiro-city-description'),
        weatherDetails: document.getElementById('weather-details'),
        mapElement: document.getElementById('map'),
        mustSeeSwiperWrapper: document.getElementById('must-see-swiper-wrapper'),
        attractionsList: document.getElementById('attractions-list'),
        toursList: document.getElementById('tours-list'),
        restaurantsList: document.getElementById('restaurants-list'),
        hotelsList: document.getElementById('hotels-list'),
        climateTipsList: document.getElementById('climate-tips-list'),
        transportList: document.getElementById('transport-list'),
        extraTipsList: document.getElementById('extra-tips-list'),
        checklistItems: document.getElementById('checklist-items')
    };

    // Variáveis de estado
    let mapInstance = null;
    let swiperPointsOfInterest = null;
    let currentCityData = null;
    let selectedStateName = '';

    // Inicialização
    function init() {
        document.getElementById('current-year').textContent = new Date().getFullYear();
        AOS.init({ duration: 800, once: true, offset: 50 });
        initTypedJS();
        initDatePicker();
        initSwiper();
        populateCountries();
        setupEventListeners();
    }

    function initTypedJS() {
        if (document.getElementById('typed-subtitle')) {
            new Typed("#typed-subtitle", {
                stringsElement: '#typed-strings-source',
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 1500,
                startDelay: 500,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        }
    }

    function initDatePicker() {
        flatpickr("#travel-dates", {
            mode: "single",
            dateFormat: "d/m/Y",
            minDate: "today",
            locale: "pt",
            onChange: function(selectedDates, dateStr, instance) {
                checkFormCompletion();
            }
        });
    }

    function initSwiper() {
        swiperPointsOfInterest = new Swiper('.mySwiperPointsOfInterest', {
            slidesPerView: 1,
            spaceBetween: 20,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
        });
    }

    function populateCountries() {
        elements.citySelect.disabled = true;
        fetchBrazilianStates();
    }

    async function fetchBrazilianStates() {
        elements.stateSelect.innerHTML = '<option value="">Carregando estados...</option>';
        
        try {
            const response = await fetch(`${IBGE_API_URL}/estados`);
            const states = await response.json();
            
            elements.stateSelect.innerHTML = '<option value="">Selecione um estado</option>';
            
            states
                .sort((a, b) => a.nome.localeCompare(b.nome))
                .forEach(state => {
                    const option = document.createElement('option');
                    option.value = state.sigla;
                    option.textContent = state.nome;
                    option.dataset.name = state.nome;
                    elements.stateSelect.appendChild(option);
                });
        } catch (error) {
            console.error("Erro ao buscar estados:", error);
            elements.stateSelect.innerHTML = '<option value="">Erro ao carregar estados</option>';
        }
    }

    async function fetchCitiesByState(stateSigla) {
        elements.citySelect.innerHTML = '<option value="">Carregando cidades...</option>';
        elements.citySelect.disabled = true;
        
        try {
            const response = await fetch(`${IBGE_API_URL}/estados/${stateSigla}/municipios`);
            const cities = await response.json();
            
            elements.citySelect.innerHTML = '<option value="">Selecione uma cidade</option>';
            
            cities
                .sort((a, b) => a.nome.localeCompare(b.nome))
                .forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.nome;
                    option.textContent = city.nome;
                    elements.citySelect.appendChild(option);
                });
            
            elements.citySelect.disabled = false;
            
            // Armazena o nome do estado selecionado
            const selectedOption = elements.stateSelect.options[elements.stateSelect.selectedIndex];
            selectedStateName = selectedOption.dataset.name || selectedOption.text;
        } catch (error) {
            console.error("Erro ao buscar cidades:", error);
            elements.citySelect.innerHTML = '<option value="">Erro ao carregar cidades</option>';
        }
    }

    function setupEventListeners() {
        elements.stateSelect.addEventListener('change', () => {
            const stateSigla = elements.stateSelect.value;
            if (stateSigla) {
                fetchCitiesByState(stateSigla);
            } else {
                elements.citySelect.innerHTML = '<option value="">Selecione um estado primeiro</option>';
                elements.citySelect.disabled = true;
            }
        });
        
        elements.citySelect.addEventListener('change', checkFormCompletion);
        elements.durationInput.addEventListener('input', checkFormCompletion);
        elements.generateBtn.addEventListener('click', generateRoteiro);
    }

    function checkFormCompletion() {
        const hasCity = elements.citySelect.value;
        const hasDuration = elements.durationInput.value > 0;
        const hasDate = document.getElementById('travel-dates').value !== '';
        
        elements.generateBtn.disabled = !(hasCity && hasDuration && hasDate);
    }

    async function generateRoteiro() {
        const selectedCity = elements.citySelect.value;
        const duration = parseInt(elements.durationInput.value);

        if (!selectedCity) {
            alert("Por favor, selecione uma cidade.");
            return;
        }

        try {
            elements.generateBtn.disabled = true;
            elements.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Gerando...';
            
            // Busca dados da cidade
            currentCityData = await fetchCityData(selectedCity);
            
            // Determina a estação do ano
            const season = determineSeason();
            const seasonInfo = await getSeasonInfo(season, selectedCity);
            
            // Atualiza a exibição
            updateRoteiroDisplay(selectedCity, duration, season, seasonInfo);
            
            // Mostra o roteiro
            elements.roteiroOutput.classList.remove('hidden');
            elements.roteiroContainer.scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error("Erro ao gerar roteiro:", error);
            alert("Ocorreu um erro ao gerar o roteiro. Por favor, tente novamente.");
        } finally {
            elements.generateBtn.disabled = false;
            elements.generateBtn.innerHTML = '<i class="fas fa-magic mr-2"></i> Gerar Roteiro Inteligente';
        }
    }

    async function fetchCityData(cityName) {
        // 1. Busca coordenadas
        const coords = await fetchCityCoordinates(cityName);
        
        // 2. Busca informações em paralelo para melhor performance
        const [weather, pointsOfInterest, description, attractions] = await Promise.all([
            fetchWeather(cityName, coords.lat, coords.lon),
            fetchPointsOfInterest(cityName, coords),
            fetchCityDescription(cityName),
            fetchTouristAttractions(cityName, selectedStateName)
        ]);
        
        return {
            coords: [coords.lat, coords.lon],
            pointsOfInterest,
            description,
            attractions,
            weather,
            commonData: {
                tours: generateTourSuggestions(cityName),
                restaurants: generateRestaurantSuggestions(cityName),
                hotels: generateHotelSuggestions(cityName),
                transportation: generateTransportSuggestions(cityName),
                extraTips: generateExtraTips(cityName)
            }
        };
    }

    async function fetchCityCoordinates(cityName) {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},BR&limit=1&appid=${OPENWEATHER_API_KEY}`
        );
        const data = await response.json();
        
        if (!data || data.length === 0) {
            throw new Error("Cidade não encontrada");
        }
        
        return {
            lat: data[0].lat,
            lon: data[0].lon
        };
    }

    async function fetchWeather(cityName, lat, lon) {
        elements.weatherDetails.innerHTML = 'Carregando clima... <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600 inline-block"></div>';
        
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
            );
            const data = await response.json();
            
            elements.weatherDetails.innerHTML = `
                <div class="flex items-center">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Ícone do clima" class="w-16 h-16 mr-4">
                    <div>
                        <p class="font-semibold">${data.name}</p>
                        <p>Temperatura: ${Math.round(data.main.temp)}°C (Mín: ${Math.round(data.main.temp_min)}°C / Máx: ${Math.round(data.main.temp_max)}°C)</p>
                        <p>Sensação térmica: ${Math.round(data.main.feels_like)}°C</p>
                        <p>Condição: ${data.weather[0].description}</p>
                        <p>Umidade: ${data.main.humidity}%</p>
                    </div>
                </div>
            `;
            
            return {
                temp: data.main.temp,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity,
                temp_min: data.main.temp_min,
                temp_max: data.main.temp_max
            };
        } catch (error) {
            console.error("Erro ao buscar clima:", error);
            elements.weatherDetails.innerHTML = '<span class="text-red-500">Não foi possível carregar o clima.</span>';
            return null;
        }
    }

    async function fetchPointsOfInterest(cityName, coords) {
        try {
            // API OpenTripMap (exemplo)
            const radius = 10000; // 10km
            const response = await fetch(
                `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${coords.lon}&lat=${coords.lat}&apikey=${OPENTRIPMAP_API_KEY}`
            );
            const data = await response.json();
            
            return data.features
                .filter(place => place.properties.name && place.properties.kinds)
                .slice(0, 10) // Limita a 10 resultados
                .map(place => ({
                    name: place.properties.name,
                    details: translatePlaceTypes(place.properties.kinds),
                    coords: [place.geometry.coordinates[1], place.geometry.coordinates[0]],
                    image: getPlaceholderImage(place.properties.kinds)
                }));
        } catch (error) {
            console.error("Erro ao buscar pontos turísticos:", error);
            return [
                { name: "Centro da Cidade", details: "Área central com comércio e serviços", coords: [coords.lat, coords.lon] },
                { name: "Parque Municipal", details: "Principal área verde da cidade", coords: [coords.lat + 0.01, coords.lon + 0.01] }
            ];
        }
    }

    async function fetchTouristAttractions(cityName, stateName) {
        try {
            // Simulação de dados - na prática você usaria uma API como Foursquare, Google Places, etc.
            // Esta é uma implementação simulada com dados pré-definidos para cidades conhecidas
            
            // Dados simulados para Gramado-RS
            if (cityName.toLowerCase() === 'gramado' && stateName.toLowerCase().includes('rio grande do sul')) {
                return [
                    {
                        name: "Rua Coberta",
                        description: "Um charmoso ponto turístico no centro de Gramado, com arquitetura inspirada nas construções europeias.",
                        tips: "Visite à noite para ver a iluminação especial. Experimente os chocolates das lojas locais.",
                        image: "img/rua-coberta.jpg"
                    },
                    {
                        name: "Lago Negro",
                        description: "Um belo lago cercado por hortênsias e araucárias, com pedalinhos disponíveis para passeio.",
                        tips: "Ótimo para fotos no outono quando as folhas mudam de cor. Leve um casaco pois pode ventar.",
                        image: "img/lago-negro.jpg"
                    },
                    {
                        name: "Snowland",
                        description: "O primeiro parque de neve indoor da América Latina, com diversas atrações e atividades na neve.",
                        tips: "Reserve com antecedência. Leve luvas e roupas quentes mesmo no verão.",
                        image: "img/snowland.png"
                    }
                ];
            }
            
            // Dados simulados para outras cidades
            return [
                {
                    name: "Principal Atração Turística",
                    description: `A atração mais famosa de ${cityName}, conhecida por sua beleza e importância cultural.`,
                    tips: "Visite no início da manhã para evitar multidões. Verifique os horários de funcionamento.",
                    image: `https://source.unsplash.com/random/600x400/?${cityName},tourist`
                },
                {
                    name: "Museu Local",
                    description: `O museu mais importante de ${cityName}, com exposições sobre a história e cultura da região.`,
                    tips: "Guarde pelo menos 2 horas para a visita completa. Há tours guiados disponíveis.",
                    image: `https://source.unsplash.com/random/600x400/?museum,${cityName}`
                },
                {
                    name: "Parque Municipal",
                    description: `O principal parque de ${cityName}, ideal para caminhadas, piqueniques e contato com a natureza.`,
                    tips: "Leve repelente em meses mais quentes. Há quiosques com lanches no local.",
                    image: `https://source.unsplash.com/random/600x400/?park,${cityName}`
                }
            ];
            
        } catch (error) {
            console.error("Erro ao buscar atrações turísticas:", error);
            return [];
        }
    }

    function translatePlaceTypes(kinds) {
        const types = {
            'historic': 'Histórico',
            'museum': 'Museu',
            'religion': 'Religioso',
            'park': 'Parque',
            'beach': 'Praia',
            'architecture': 'Arquitetura',
            'cultural': 'Cultural',
            'nature': 'Natureza',
            'viewpoint': 'Mirante',
            'food': 'Gastronomia',
            'theatre': 'Teatro',
            'cinema': 'Cinema',
            'zoo': 'Zoológico',
            'garden': 'Jardim'
        };
        
        return kinds.split(',')
            .map(kind => types[kind] || kind)
            .filter(Boolean)
            .slice(0, 3)
            .join(', ');
    }

    function getPlaceholderImage(kinds) {
        if (kinds.includes('beach')) return 'https://source.unsplash.com/random/600x400/?beach';
        if (kinds.includes('park')) return 'https://source.unsplash.com/random/600x400/?park';
        if (kinds.includes('museum')) return 'https://source.unsplash.com/random/600x400/?museum';
        if (kinds.includes('historic')) return 'https://source.unsplash.com/random/600x400/?historic';
        if (kinds.includes('nature')) return 'https://source.unsplash.com/random/600x400/?nature';
        return 'https://source.unsplash.com/random/600x400/?city,attraction';
    }

    async function fetchCityDescription(cityName) {
        try {
            // Tenta buscar da Wikipedia
            const response = await fetch(
                `${WIKIPEDIA_API_URL}?action=query&format=json&prop=extracts&exintro=true&titles=${cityName}&origin=*`
            );
            const data = await response.json();
            const page = Object.values(data.query.pages)[0];
            
            if (page.extract) {
                // Remove tags HTML e limita o tamanho
                return page.extract.replace(/<[^>]+>/g, '').substring(0, 500) + '...';
            }
        } catch (error) {
            console.error("Erro ao buscar descrição:", error);
        }
        
        // Descrição genérica se não encontrar na Wikipedia
        return `${cityName} é uma cidade localizada no estado ${selectedStateName}, conhecida por suas atrações turísticas, cultura rica e belas paisagens. Um destino perfeito para quem busca ${determineSeason().toLowerCase()} agradável e experiências memoráveis.`;
    }

    async function getSeasonInfo(season, cityName) {
        const tips = {
            'Verão': {
                description: `O verão em ${cityName} é caracterizado por dias quentes e ensolarados, perfeitos para atividades ao ar livre.`,
                tips: [
                    "Use protetor solar regularmente",
                    "Hidrate-se frequentemente",
                    "Prefira passeios no início da manhã ou final da tarde",
                    "Use roupas leves e claras",
                    "Leve um chapéu ou boné"
                ]
            },
            'Outono': {
                description: `O outono em ${cityName} traz temperaturas amenas e paisagens com folhas coloridas, criando cenários encantadores.`,
                tips: [
                    "Leve um casaco leve para as noites mais frescas",
                    "Aproveite para fotografar a mudança das folhas",
                    "Experimente os pratos típicos da estação",
                    "Visite parques para apreciar a natureza",
                    "Verifique os horários de atrações que podem mudar na baixa temporada"
                ]
            },
            'Inverno': {
                description: `O inverno em ${cityName} pode ser frio, com possibilidade de neve em algumas regiões, criando um clima aconchegante.`,
                tips: [
                    "Leve roupas quentes e várias camadas",
                    "Aproveite bebidas quentes locais",
                    "Visite museus e atrações internas",
                    "Verifique se as atrações ao ar livre estão abertas",
                    "Cuidado com piso escorregadio em dias de geada"
                ]
            },
            'Primavera': {
                description: `A primavera em ${cityName} traz flores, temperaturas agradáveis e a natureza em seu esplendor.`,
                tips: [
                    "Aproveite para caminhar em parques e jardins",
                    "Leve um guarda-chuva para chuvas passageiras",
                    "Experimente os festivais e eventos da estação",
                    "Use roupas em camadas para variações de temperatura",
                    "Visite plantações e campos floridos"
                ]
            }
        };
        
        return tips[season] || {
            description: `${cityName} é um destino agradável em qualquer época do ano.`,
            tips: [
                "Verifique a previsão do tempo antes de sair",
                "Planeje com antecedência suas atividades",
                "Tenha sempre um plano B para dias de chuva"
            ]
        };
    }

    function generateTourSuggestions(cityName) {
        // Simula sugestões baseadas no tipo de cidade
        if (cityName.toLowerCase().includes('rio')) {
            return [
                "Passeio de bondinho no Pão de Açúcar",
                "Visita ao Cristo Redentor",
                "Passeio de barco pela Baía de Guanabara",
                "Tour pelas favelas com guia local",
                "Visita ao Jardim Botânico"
            ];
        } else if (cityName.toLowerCase().includes('gramado')) {
            return [
                "Tour pela Rua Coberta e chocolates artesanais",
                "Visita ao Mini Mundo",
                "Passeio de trem no Vale do Quilombo",
                "Tour pelas vinícolas da região",
                "Visita ao Snowland (parque de neve indoor)"
            ];
        }
        return [
            "Tour pelo centro histórico",
            "Visita aos principais pontos turísticos",
            "Passeio de dia inteiro pela cidade",
            "Tour gastronômico pelos restaurantes locais",
            "Visita aos parques naturais da região"
        ];
    }

    function generateRestaurantSuggestions(cityName) {
        // Simula sugestões genéricas
        if (cityName.toLowerCase().includes('gramado')) {
            return [
                { name: "Chocolates Lugano", type: "Chocolateria", note: "Famosa pelos chocolates artesanais e fondue" },
                { name: "Restaurante Colucci", type: "Cozinha Italiana", note: "Excelente massa fresca e ambiente familiar" },
                { name: "Café do Tempo", type: "Cafeteria", note: "Ótimo para café da manhã colonial" }
            ];
        }
        return [
            { name: "Restaurante Local", type: "Cozinha Regional", note: "Experimente os pratos típicos da região" },
            { name: "Café Central", type: "Cafeteria", note: "Ótimo para um café da manhã reforçado" },
            { name: "Churrascaria Tradicional", type: "Churrascaria", note: "Carnes selecionadas e buffet de saladas" }
        ];
    }

    function generateHotelSuggestions(cityName) {
        if (cityName.toLowerCase().includes('gramado')) {
            return [
                { name: "Hotel Serra Azul", category: "4 estrelas", costBenefit: "Excelente", note: "Localização central e café da manhã incluso" },
                { name: "Pousada Chalé da Neve", category: "3 estrelas", costBenefit: "Bom", note: "Ambiente aconchegante e familiar" }
            ];
        }
        return [
            { name: "Hotel Central", category: "3 estrelas", costBenefit: "Bom", note: "Localização privilegiada no centro" },
            { name: "Pousada Charmosa", category: "4 estrelas", costBenefit: "Excelente", note: "Atendimento personalizado e café da manhã incluso" }
        ];
    }

    function generateTransportSuggestions(cityName) {
        if (cityName.toLowerCase().includes('gramado')) {
            return [
                "Aluguel de carro é recomendado para explorar a região",
                "Táxis e Uber estão disponíveis na cidade",
                "Ônibus turísticos com roteiros pelos principais pontos",
                "Serviço de transfer para aeroporto disponível"
            ];
        }
        return [
            "Aplicativos de transporte funcionam bem na cidade",
            "Ônibus turísticos disponíveis para os principais pontos",
            "Aluguel de carros é uma opção para maior liberdade",
            "Táxis convencionais e por aplicativo estão disponíveis"
        ];
    }

    function generateExtraTips(cityName) {
        const season = determineSeason();
        let tips = [
            "Tenha sempre dinheiro em espécie para pequenas compras",
            "Verifique o clima antes de sair para passeios",
            "Baixe mapas offline caso vá para áreas com pouca conexão"
        ];
        
        if (season === "Verão") {
            tips.push("Leve protetor solar e chapéu");
            tips.push("Prefira roupas leves e claras");
        } else if (season === "Inverno") {
            tips.push("Leve roupas quentes em camadas");
            tips.push("Beba líquidos quentes para se aquecer");
        }
        
        if (cityName.toLowerCase().includes('gramado')) {
            tips.push("Experimente os chocolates artesanais locais");
            tips.push("Reserve restaurantes com antecedência na alta temporada");
        }
        
        return tips;
    }

    function determineSeason() {
        const dateInput = document.getElementById('travel-dates');
        if (!dateInput.value) return "Qualquer época";
        
        const dateParts = dateInput.value.split('/');
        const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        const month = date.getMonth() + 1; // Janeiro é 0
        
        if (month >= 12 || month <= 2) return "Verão";
        if (month >= 3 && month <= 5) return "Outono";
        if (month >= 6 && month <= 8) return "Inverno";
        return "Primavera";
    }

    function updateRoteiroDisplay(cityName, duration, season, seasonInfo) {
        elements.roteiroCityName.textContent = cityName;
        elements.roteiroDuration.textContent = duration;
        elements.roteiroSeason.textContent = season;
        elements.roteiroState.textContent = selectedStateName;
        elements.roteiroCityDescription.textContent = currentCityData.description;
        
        // Atualiza o mapa
        initOrUpdateMap(currentCityData.coords, currentCityData.pointsOfInterest, cityName);
        
        // Preenche as seções
        fillRoteiroSections(season, seasonInfo);
    }

    function fillRoteiroSections(season, seasonInfo) {
        // Preenche os pontos turísticos no Swiper
        fillMustSeeSwiper(currentCityData.pointsOfInterest);
        
        // Preenche as atrações detalhadas
        fillAttractionsSection(currentCityData.attractions);
        
        // Preenche as outras seções
        fillSection(elements.toursList, currentCityData.commonData.tours, 
                   "Nenhuma sugestão de passeio específica para esta seleção.",
                   item => `<li class="mb-3 p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">${item}</li>`);
        
        fillSection(elements.restaurantsList, currentCityData.commonData.restaurants, 
                   "Nenhuma sugestão de restaurante listada.",
                   item => `<li class="mb-3 p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">
                               <strong>${item.name}</strong> (${item.type})<br>
                               <span class="text-sm text-slate-600">${item.note}</span>
                           </li>`);
        
        fillSection(elements.hotelsList, currentCityData.commonData.hotels,
                   "Nenhuma sugestão de hotel listada.",
                   item => `<li class="mb-3 p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">
                               <strong>${item.name}</strong> (${item.category}) - Custo-Benefício: ${item.costBenefit}<br>
                               <span class="text-sm text-slate-600">${item.note || ''}</span>
                           </li>`);
        
        fillClimateTips(season, seasonInfo);
        fillSection(elements.transportList, currentCityData.commonData.transportation, 
                   "Nenhuma dica de transporte listada.",
                   item => `<li class="mb-3 p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">${item}</li>`);
        fillSection(elements.extraTipsList, currentCityData.commonData.extraTips, 
                   "Nenhuma dica extra listada.",
                   item => `<li class="mb-3 p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">${item}</li>`);
        
        generateChecklist(season);
    }

    function fillMustSeeSwiper(pointsOfInterest) {
        elements.mustSeeSwiperWrapper.innerHTML = '';
        
        if (pointsOfInterest && pointsOfInterest.length > 0) {
            pointsOfInterest.forEach(poi => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide bg-white p-4 rounded-lg shadow-md border border-slate-200';
                slide.innerHTML = `
                    <div class="h-full flex flex-col">
                        ${poi.image ? `<img src="${poi.image}" alt="${poi.name}" class="w-full h-40 object-cover rounded-lg mb-3">` : ''}
                        <h4 class="font-bold text-lg text-sky-700 mb-2">${poi.name}</h4>
                        <p class="text-slate-600 flex-grow">${poi.details}</p>
                        <div class="mt-3 p-2 bg-sky-50 rounded text-sm text-sky-700">
                            <strong>Dica:</strong> Ótimo para fotos e passeios turísticos
                        </div>
                    </div>
                `;
                elements.mustSeeSwiperWrapper.appendChild(slide);
            });
            
            swiperPointsOfInterest.update();
        }
    }

    function fillAttractionsSection(attractions) {
        elements.attractionsList.innerHTML = '';
        
        if (attractions && attractions.length > 0) {
            attractions.forEach(attraction => {
                const card = document.createElement('div');
                card.className = 'place-card bg-white rounded-lg shadow-md overflow-hidden border border-slate-200';
                card.innerHTML = `
                    <div class="h-48 overflow-hidden">
                        <img src="${attraction.image}" alt="${attraction.name}" class="w-full h-full object-cover">
                    </div>
                    <div class="p-4">
                        <h4 class="font-bold text-lg text-sky-700 mb-2">${attraction.name}</h4>
                        <p class="text-slate-600 mb-3">${attraction.description}</p>
                        <div class="bg-amber-50 p-3 rounded-lg">
                            <h5 class="font-semibold text-amber-700 mb-1"><i class="fas fa-lightbulb mr-1"></i>Dicas</h5>
                            <p class="text-sm text-amber-800">${attraction.tips}</p>
                        </div>
                    </div>
                `;
                elements.attractionsList.appendChild(card);
            });
        } else {
            elements.attractionsList.innerHTML = '<p class="text-slate-500 italic">Nenhuma atração detalhada encontrada para esta cidade.</p>';
        }
    }

    function fillSection(container, items, emptyMessage, formatter = null) {
        container.innerHTML = '';
        
        if (!items || items.length === 0) {
            container.innerHTML = `<li class="text-slate-500 italic">${emptyMessage}</li>`;
            return;
        }
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'mb-3 last:mb-0';
            li.innerHTML = formatter ? formatter(item) : item;
            container.appendChild(li);
        });
    }

    function fillClimateTips(season, seasonInfo) {
        elements.climateTipsList.innerHTML = '';
        
        const tips = [];
        
        // Adiciona informações climáticas atuais se disponíveis
        if (currentCityData.weather) {
            tips.push(`
                <li class="mb-3 p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">
                    <strong>Clima Atual:</strong> ${Math.round(currentCityData.weather.temp)}°C (máx ${Math.round(currentCityData.weather.temp_max)}°C / mín ${Math.round(currentCityData.weather.temp_min)}°C)<br>
                    <strong>Sensação Térmica:</strong> ${Math.round(currentCityData.weather.feels_like)}°C<br>
                    <strong>Condição:</strong> ${currentCityData.weather.description}<br>
                    <strong>Umidade:</strong> ${currentCityData.weather.humidity}%
                </li>
            `);
        }
        
        // Adiciona descrição da estação
        if (seasonInfo.description) {
            tips.push(`
                <li class="mb-3 p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">
                    <strong>Características do ${season}:</strong> ${seasonInfo.description}
                </li>
            `);
        }
        
        // Adiciona dicas específicas para a estação
        if (seasonInfo.tips && seasonInfo.tips.length > 0) {
            const tipsList = seasonInfo.tips.map(tip => `<li class="mb-1">${tip}</li>`).join('');
            tips.push(`
                <li class="mb-3 p-3 bg-sky-50 rounded-lg border-l-4 border-sky-500">
                    <strong>Dicas para o ${season}:</strong>
                    <ul class="list-disc pl-5 mt-2">${tipsList}</ul>
                </li>
            `);
        }
        
        if (tips.length === 0) {
            tips.push('<li class="text-slate-500 italic">Informações climáticas não disponíveis para esta época.</li>');
        }
        
        elements.climateTipsList.innerHTML = tips.join('');
    }

    function initOrUpdateMap(coords, pointsOfInterest, cityName) {
        if (mapInstance) mapInstance.remove();
        
        mapInstance = L.map(elements.mapElement).setView(coords, 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapInstance);

        // Marcador principal
        L.marker(coords).addTo(mapInstance)
            .bindPopup(`<b>${cityName}</b><br>Centro da cidade`)
            .openPopup();

        // Marcadores para pontos de interesse
        if (pointsOfInterest && pointsOfInterest.length > 0) {
            const markers = [];
            
            pointsOfInterest.forEach(poi => {
                const marker = L.marker(poi.coords).addTo(mapInstance)
                    .bindPopup(`<b>${poi.name}</b><br>${poi.details}`);
                markers.push(marker);
            });
            
            if (markers.length > 0) {
                const group = L.featureGroup(markers).addTo(mapInstance);
                mapInstance.fitBounds(group.getBounds().pad(0.2));
            }
        }
    }

    function generateChecklist(season) {
        elements.checklistItems.innerHTML = '';
        
        const items = [
            "Documento de identidade ou passaporte",
            "Passagens e reservas impressas ou no celular",
            "Dinheiro e cartões",
            "Celular e carregador",
            "Adaptador de tomada (se necessário)",
            "Medicamentos pessoais",
            `Roupas para ${elements.durationInput.value} dias`
        ];

        // Itens por estação
        if (season === "Verão") {
            items.push("Protetor solar", "Óculos de sol", "Chapéu", "Roupa de banho", "Repelente de insetos");
        } else if (season === "Inverno") {
            items.push("Casaco quente", "Cachecol", "Luvas", "Calçados fechados", "Termos para bebidas quentes");
        } else if (season === "Outono" || season === "Primavera") {
            items.push("Guarda-chuva", "Casaco leve", "Calçados confortáveis para caminhadas");
        }

        // Itens específicos
        if (currentCityData.description.toLowerCase().includes("praia")) {
            items.push("Toalha de praia", "Chinelo", "Saco estanque para celular");
        }
        if (currentCityData.description.toLowerCase().includes("montanha")) {
            items.push("Tênis de caminhada", "Mochila pequena", "Garrafa de água reutilizável");
        }

        // Renderiza os itens
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'flex items-center mb-2 last:mb-0 p-2 hover:bg-sky-50 rounded-lg';
            
            const checkboxId = `check-${item.replace(/\s+/g, '-').toLowerCase()}`;
            li.innerHTML = `
                <input type="checkbox" id="${checkboxId}" class="mr-3 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500">
                <label for="${checkboxId}" class="cursor-pointer flex-grow">${item}</label>
            `;
            
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => {
                li.querySelector('label').classList.toggle('line-through', checkbox.checked);
                li.querySelector('label').classList.toggle('text-slate-400', checkbox.checked);
            });
            
            elements.checklistItems.appendChild(li);
        });
    }

    // Inicia a aplicação
    init();
});