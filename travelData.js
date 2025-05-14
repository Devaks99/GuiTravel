// travelData.js

const travelData = {
    "Brasil": {
        cities: {
            "Gramado (RS)": {
                coords: [-29.3787, -50.8767],
                description: "Encantadora cidade serrana com arquitetura europeia, famosa pelo Natal Luz e festivais de cinema. Ideal para casais e famílias que buscam charme e boa gastronomia.",
                pointsOfInterest: [
                    { name: "Rua Torta", details: "Rua sinuosa e florida, um dos cartões postais. Ótima para fotos instagramáveis." },
                    { name: "Lago Negro", details: "Alugue um pedalinho em forma de cisne e aprecie a paisagem. Caminhe ao redor do lago." },
                    { name: "Mini Mundo", details: "Parque temático com réplicas perfeitas de construções famosas em miniatura. Encanta crianças e adultos." },
                    { name: "Snowland", details: "Primeiro parque de neve indoor das Américas. Diversão garantida com esqui, snowboard e tubing." },
                    { name: "Igreja Matriz São Pedro Apóstolo", details: "Construção imponente em pedra basáltica no centro da cidade." }
                ],
                commonData: { // Informações gerais, não específicas da estação
                    restaurants: [
                        { name: "Casa da Velha Bruxa", type: "Café/Doces", note: "Experimente os chocolates quentes, apfelstrudel e waffles. Clássico!" },
                        { name: "Cantina Pastasciutta", type: "Italiano", note: "Massas fartas e ambiente animado e tradicional. Chegue cedo ou reserve." },
                        { name: "Josephina Café", type: "Bistrô/Café", note: "Ambiente charmoso, ideal para um café da tarde ou refeição leve." },
                        { name: "Empório Canela", type: "Variado/Bistrô (em Canela)", note: "Excelente opção na cidade vizinha, com livraria e ambiente acolhedor." }
                    ],
                    hotels: [
                        { name: "Hotel Ritta Höppner", category: "Luxo/Charme", costBenefit: "Alto (experiência única, inclui acesso ao Mini Mundo em algumas tarifas)" },
                        { name: "Pousada Vovó Carolina", category: "Médio/Aconchegante", costBenefit: "Excelente (ótima localização e café da manhã elogiado)" },
                        { name: "Hotel Sky Gramado", category: "Médio/Moderno", costBenefit: "Bom (boa estrutura e vista panorâmica em alguns quartos)" },
                        { name: "Hostel Chocolatchê", category: "Econômico", costBenefit: "Bom para viajantes solo ou jovens, ambiente descontraído" }
                    ],
                    transportation: [
                        "Alugar um carro oferece flexibilidade, especialmente se planeja visitar Canela e arredores.",
                        "A área central de Gramado é bastante caminhável.",
                        "Aplicativos de transporte (Uber, 99) funcionam bem na região.",
                        "Há ônibus turísticos (Bustour) que cobrem os principais pontos de Gramado e Canela."
                    ],
                    extraTips: [
                        "Leve agasalho mesmo no verão, pois as noites na serra podem ser frias.",
                        "Não deixe de provar os chocolates artesanais de Gramado.",
                        "Se visitar durante o Natal Luz (normalmente de Outubro a Janeiro), compre ingressos para os espetáculos com antecedência.",
                        "Visite Canela, cidade vizinha, que também oferece muitas atrações (Parque do Caracol, Catedral de Pedra)."
                    ]
                },
                seasonalData: {
                    "Verão (Dez-Fev)": {
                        climate: "Dias geralmente quentes e ensolarados, noites frescas. Chuvas de verão podem ocorrer. Média 18-28°C.",
                        tours: ["Passeios ao ar livre como o Lago Negro e parques", "Visitar vinícolas na região (com moderação)", "Curtir as hortênsias floridas (pico em Dez/Jan)"],
                        notes: "Menos lotado que no inverno (exceto Natal Luz). Hidrate-se bem. Protetor solar indispensável."
                    },
                    "Outono (Mar-Mai)": {
                        climate: "Temperaturas amenas e agradáveis, paisagens com tons outonais. Menor incidência de chuva. Média 12-22°C.",
                        tours: ["Ideal para caminhadas e explorar a natureza", "Festival de Cinema de Gramado (geralmente em Agosto, mas o clima de outono é bom para eventos culturais)", "Rota Romântica"],
                        notes: "Ótima época para quem busca tranquilidade e clima ameno. As cores da estação deixam a cidade ainda mais bonita."
                    },
                    "Inverno (Jun-Ago)": {
                        climate: "Frio, com possibilidade de geada e, raramente, neve. Média 5-15°C, podendo ser negativa.",
                        tours: ["Snowland", "Museu de Cera Dreamland e outros museus temáticos", "Sequência de Fondue à noite (um clássico!)", "Aproveitar o charme das lareiras e vinhos"],
                        notes: "Alta temporada, especialmente em julho. Cidade lotada, preços mais altos. Reserve tudo com antecedência. Leve roupas bem quentes (casacos, luvas, gorros)."
                    },
                    "Primavera (Set-Nov)": {
                        climate: "Clima ameno e florido, temperaturas em elevação. Média 10-20°C.",
                        tours: ["A cidade fica colorida com as flores da estação", "Visitar parques e jardins", "Início dos preparativos e eventos do Natal Luz (a partir de Outubro)"],
                        notes: "Boa época para evitar multidões do inverno e do pico do verão. Clima agradável para passeios."
                    }
                }
            },
            "Rio de Janeiro (RJ)": {
                coords: [-22.9068, -43.1729],
                description: "A Cidade Maravilhosa, mundialmente famosa por suas praias icônicas, montanhas imponentes, samba e carnaval vibrante.",
                pointsOfInterest: [
                    { name: "Cristo Redentor", details: "Principal cartão postal, vista panorâmica espetacular da cidade." },
                    { name: "Pão de Açúcar", details: "Passeio de teleférico com vistas deslumbrantes da Baía de Guanabara." },
                    { name: "Praia de Copacabana e Ipanema", details: "Praias mundialmente famosas, ótimas para caminhar, tomar sol e sentir a vibe carioca." },
                    { name: "Escadaria Selarón", details: "Obra de arte colorida e vibrante no bairro da Lapa." },
                    { name: "Jardim Botânico", details: "Oásis de tranquilidade com vasta coleção de plantas tropicais." }
                ],
                commonData: {
                     restaurants: [
                        { name: "Confeitaria Colombo", type: "Café/Histórico", note: "Tradicional e suntuosa, vale pela experiência e doces." },
                        { name: "Bar Urca", type: "Boteco/Frutos do Mar", note: "Petiscos e cerveja com vista para a mureta da Urca." },
                        { name: "Aprazível", type: "Brasileira/Sofisticada", note: "Cozinha brasileira com vista incrível em Santa Teresa." }
                    ],
                    hotels: [
                        { name: "Belmond Copacabana Palace", category: "Luxo/Icônico", costBenefit: "Muito Alto (experiência lendária)" },
                        { name: "Arena Ipanema Hotel", category: "Médio/Moderno", costBenefit: "Bom (localização privilegiada em Ipanema, bom custo-benefício)" },
                        { name: "Selina Lapa Rio", category: "Econômico/Hostel & Hotel", costBenefit: "Excelente (opções variadas, design moderno, vida noturna próxima)" }
                    ],
                    transportation: [
                        "Metrô é uma ótima opção para se locomover entre as zonas Sul, Centro e parte da Norte.",
                        "Aplicativos de transporte são amplamente disponíveis.",
                        "Ônibus cobrem toda a cidade, mas podem ser demorados devido ao trânsito.",
                        "Evite dirigir se não conhece bem a cidade, o trânsito pode ser caótico."
                    ],
                    extraTips: [
                        "Tenha atenção com seus pertences, especialmente em áreas turísticas e praias.",
                        "Use protetor solar e beba muita água, principalmente no verão.",
                        "Experimente a culinária local: feijoada, açaí, biscoito Globo.",
                        "Aproveite a vida noturna na Lapa, mas vá com cuidado."
                    ]
                },
                seasonalData: { // Simplificado para o Rio
                    "Verão (Dez-Fev)": {
                        climate: "Muito quente e úmido, com chuvas de verão frequentes no final da tarde. Média 25-35°C (sensação pode ser maior).",
                        tours: ["Praias (Copacabana, Ipanema, Leblon, Barra)", "Carnaval (Fevereiro/Março)", "Passeios de barco", "Trilhas cedo pela manhã"],
                        notes: "Altíssima temporada, especialmente no Carnaval e Réveillon. Hidratação constante é crucial. Praias lotadas."
                    },
                    "Outono (Mar-Mai)": {
                        climate: "Temperaturas mais amenas, menos chuva. Considerada uma das melhores épocas. Média 20-28°C.",
                        tours: ["Ideal para todas as atividades ao ar livre", "Visitar pontos turísticos com clima mais agradável", "Eventos culturais"],
                        notes: "Menos turistas que no verão, preços podem ser melhores."
                    },
                    "Inverno (Jun-Ago)": {
                        climate: "Clima ameno e seco, dias ensolarados e noites frescas. Média 18-25°C.",
                        tours: ["Excelente para explorar a cidade sem o calor intenso", "Trilhas", "Museus", "Vida noturna"],
                        notes: "Baixa temporada (exceto férias de julho). Ótimo para quem não gosta de calor extremo."
                    },
                    "Primavera (Set-Nov)": {
                        climate: "Temperaturas agradáveis, dias mais longos, florescendo. Média 20-28°C.",
                        tours: ["Passeios ao ar livre", "Jardim Botânico exuberante", "Rock in Rio (quando ocorre)"],
                        notes: "Boa alternativa ao verão, com clima ainda quente o suficiente para praias."
                    }
                }
            }
            // Adicionar mais cidades do Brasil aqui...
        }
    },
};