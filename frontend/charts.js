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
    let educatie = [0, 0, 0, 0, 0, 0, 0];    dateSomeri.forEach(judet => {
        numeJudete.push(judet.judet);
        totalSomeri.push(judet.total_someri);

        totalFemei += parseInt(judet.someri_femei) || 0;
        totalBarbati += parseInt(judet.someri_barbati) || 0;
        totalUrban += parseInt(judet.someri_urban) || 0;
        totalRural += parseInt(judet.someri_rural) || 0;

        varste[0] += parseInt(judet.varsta_sub_25) || 0;
        varste[1] += parseInt(judet.varsta_25_29) || 0;
        varste[2] += parseInt(judet.varsta_30_39) || 0;
        varste[3] += parseInt(judet.varsta_40_49) || 0;
        varste[4] += parseInt(judet.varsta_50_55) || 0;
        varste[5] += parseInt(judet.varsta_peste_55) || 0;

        educatie[0] += parseInt(judet.edu_fara_studii) || 0;
        educatie[1] += parseInt(judet.edu_primar) || 0;
        educatie[2] += parseInt(judet.edu_gimnazial) || 0;
        educatie[3] += parseInt(judet.edu_liceal) || 0;
        educatie[4] += parseInt(judet.edu_postliceal) || 0;
        educatie[5] += parseInt(judet.edu_profesional) || 0;
        educatie[6] += parseInt(judet.edu_universitar) || 0;
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