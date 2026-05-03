let barChartInstance = null;
let pieChartInstance = null;
let doughnutChartInstance = null;
let ageChartInstance = null;  
let eduChartInstance = null;  
let evolutionChartInstance = null; 

function deseneazaGrafice(dateSomeri) {

    const numeJudete = [];
    const totalSomeri = [];
    let totalFemei = 0;
    let totalBarbati = 0;
    let totalUrban = 0;
    let totalRural = 0;

    let varste = [0, 0, 0, 0, 0, 0]; 
    let educatie = [0, 0, 0, 0, 0, 0, 0];
    dateSomeri.forEach(judet => {
        numeJudete.push(judet.judet);
        totalSomeri.push(judet.total_someri);

        totalFemei += judet.femei;
        totalBarbati += judet.barbati;
        totalUrban += judet.urban;
        totalRural += judet.rural;

        varste[0] += judet.sub_25;
        varste[1] += judet.intre_25_29;
        varste[2] += judet.intre_30_39;
        varste[3] += judet.intre_40_49;
        varste[4] += judet.intre_50_55;
        varste[5] += judet.peste_55;

        educatie[0] += judet.fara_studii;
        educatie[1] += judet.primar;
        educatie[2] += judet.gimnazial;
        educatie[3] += judet.liceal;
        educatie[4] += judet.postliceal;
        educatie[5] += judet.profesional;
        educatie[6] += judet.universitar;
    });

    // Grafic 1: Bar Chart (Județe)
    const ctxBar = document.getElementById('mainBarChart').getContext('2d');
    if (barChartInstance) barChartInstance.destroy();
    barChartInstance = new Chart(ctxBar, {
        type: 'bar',
        data: {
            labels: numeJudete, 
            datasets: [{
                label: 'Total Șomeri',
                data: totalSomeri, 
                backgroundColor: 'rgba(37, 99, 235, 0.7)', 
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Grafic 2: Pie (Gen)
    const ctxPie = document.getElementById('genderPieChart').getContext('2d');
    if (pieChartInstance) pieChartInstance.destroy();
    pieChartInstance = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: ['Femei', 'Bărbați'],
            datasets: [{ data: [totalFemei, totalBarbati], backgroundColor: ['#ec4899', '#3b82f6'], borderWidth: 1 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Grafic 3: Doughnut (Mediu)
    const ctxDoughnut = document.getElementById('mediuDoughnutChart').getContext('2d');
    if (doughnutChartInstance) doughnutChartInstance.destroy();
    doughnutChartInstance = new Chart(ctxDoughnut, {
        type: 'doughnut',
        data: {
            labels: ['Urban', 'Rural'],
            datasets: [{ data: [totalUrban, totalRural], backgroundColor: ['#f59e0b', '#10b981'], borderWidth: 1 }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });

    // Grafic 4: Vârstă (Bar Chart)
    const ctxAge = document.getElementById('ageBarChart').getContext('2d');
    if (ageChartInstance) ageChartInstance.destroy();
    ageChartInstance = new Chart(ctxAge, {
        type: 'bar',
        data: {
            labels: ['< 25 ani', '25-29 ani', '30-39 ani', '40-49 ani', '50-55 ani', '> 55 ani'],
            datasets: [{
                label: 'Număr Șomeri',
                data: varste,
                backgroundColor: 'rgba(139, 92, 246, 0.7)', 
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    // Grafic 5: Educație (Bar Chart)
    const ctxEdu = document.getElementById('eduBarChart').getContext('2d');
    if (eduChartInstance) eduChartInstance.destroy();
    eduChartInstance = new Chart(ctxEdu, {
        type: 'bar', 
        data: {
            labels: ['Fără studii', 'Primar', 'Gimnazial', 'Liceal', 'Postliceal', 'Profesional', 'Universitar'],
            datasets: [{
                label: 'Număr Șomeri',
                data: educatie,
                backgroundColor: 'rgba(16, 185, 129, 0.7)', 
                borderWidth: 1
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

// Grafic 6: Evoluție în Timp (Line Chart)
function deseneazaEvolutie(dateEvolutie) {
    const eticheteTimp = [];
    const valoriSomeri = []; 

    if (!dateEvolutie || dateEvolutie.length === 0) return;

    dateEvolutie.forEach(rand => {
        let lunaFormatata = rand.luna < 10 ? '0' + rand.luna : rand.luna;
        eticheteTimp.push(`${lunaFormatata}/${rand.an}`);
        valoriSomeri.push(rand.total);
    });

    const panza = document.getElementById('evolutionLineChart');
    if (!panza) {
        console.error("Nu găsesc canvas-ul evolutionLineChart în HTML!");
        return;
    }
    
    const ctxEvolutie = panza.getContext('2d');
    
    if (evolutionChartInstance !== null) {
        evolutionChartInstance.destroy();
    }

    evolutionChartInstance = new Chart(ctxEvolutie, {
        type: 'line',
        data: {
            labels: eticheteTimp,
            datasets: [{
                label: 'Total Șomeri',
                data: valoriSomeri,
                borderColor: '#ef4444', 
                backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                borderWidth: 3,
                pointBackgroundColor: '#ef4444',
                pointRadius: 5,
                fill: true,
                tension: 0.4 
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: false } 
            }
        }
    });
}