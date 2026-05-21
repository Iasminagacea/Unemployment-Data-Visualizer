let mapInstance = null;

const judeteCoordonate = {
    "ALBA": [46.2, 23.5],
    "ARAD": [46.2, 21.3],
    "ARGES": [44.8, 24.7],
    "BACAU": [46.6, 26.9],
    "BIHOR": [47.1, 21.9],
    "BISTRITA-NASAUD": [47.1, 24.5],
    "BOTOSANI": [47.75, 26.7],
    "BRAILA": [45.3, 27.7],
    "BRASOV": [45.6, 25.6],
    "BUCURESTI": [44.4, 26.1],
    "BUZAU": [45.1, 26.8],
    "CALARASI": [44.5, 27.3],
    "CARAS-SEVERIN": [44.7, 22.2],
    "CLUJ": [46.8, 23.6],
    "CONSTANTA": [44.1, 28.6],
    "COVASNA": [45.8, 26.2],
    "DAMBOVITA": [44.7, 25.4],
    "DOLJ": [44.3, 23.8],
    "GALATI": [45.4, 28.0],
    "GIURGIU": [43.9, 25.5],
    "GORJ": [45.3, 23.3],
    "HARGHITA": [46.4, 25.5],
    "HUNEDOARA": [45.8, 22.9],
    "IALOMITA": [44.8, 27.5],
    "IASI": [47.2, 27.6],
    "ILFOV": [44.7, 26.3],
    "MARAMURES": [47.6, 24.3],
    "MEHEDINTI": [44.6, 22.6],
    "MURES": [46.5, 24.5],
    "NEAMT": [46.9, 26.4],
    "OLT": [44.4, 24.8],
    "PRAHOVA": [45.3, 25.8],
    "SALAJ": [47.7, 23.8],
    "SATU MARE": [47.8, 22.9],
    "SIBIU": [45.8, 24.2],
    "SUCEAVA": [47.6, 26.3],
    "TELEORMAN": [43.8, 25.4],
    "TIMIS": [45.8, 21.2],
    "TULCEA": [44.8, 28.8],
    "VALCEA": [45.2, 24.4],
    "VASLUI": [46.6, 27.7],
    "VRANCEA": [45.4, 26.8]
};

function deseneazaHarta(dateSomeri) {
    if (!mapInstance) {
        mapInstance = L.map('harta-somaj').setView([45.9432, 24.9668], 7);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(mapInstance);
    } else {
        mapInstance.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) {
                mapInstance.removeLayer(layer);
            }
        });
    }

    if (!dateSomeri || dateSomeri.length === 0) return;

    const valori = dateSomeri.map(d => d.total_someri);
    const minVal = Math.min(...valori);
    const maxVal = Math.max(...valori);

    function getColor(value) {
        const percent = (value - minVal) / (maxVal - minVal);
        if (percent < 0.2) return '#90EE90'; // Verde deschis
        if (percent < 0.4) return '#FFD700'; // Galben
        if (percent < 0.6) return '#FFA500'; // Portocaliu-galben
        if (percent < 0.8) return '#FF6347'; // Portocaliu
        return '#8B0000'; // Roșu închis
    }

    dateSomeri.forEach(judet => {
        const coordonate = judeteCoordonate[judet.judet];
        if (!coordonate) return;

        const color = getColor(judet.total_someri);
        const radius = 5 + (judet.total_someri / maxVal) * 15;

        const circle = L.circleMarker(coordonate, {
            radius: radius,
            fillColor: color,
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.7
        }).addTo(mapInstance);

        circle.bindPopup(`
            <strong>${judet.judet}</strong><br>
            Total Șomeri: ${judet.total_someri}<br>
            Femei: ${judet.someri_femei}<br>
            Bărbați: ${judet.someri_barbati}<br>
            Urban: ${judet.someri_urban}<br>
            Rural: ${judet.someri_rural}
        `);
    });
}

function adaugaLegendharta() {
    if (mapInstance && !document.getElementById('legend')) {
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'info legend');
            div.id = 'legend';
            div.innerHTML = `
                <h4 style="margin: 0 0 10px; font-weight: bold;">Legenda</h4>
                <p><span style="background: #90EE90; width: 20px; height: 20px; display: inline-block; border: 1px solid #000;"></span> Foarte Puțini</p>
                <p><span style="background: #FFD700; width: 20px; height: 20px; display: inline-block; border: 1px solid #000;"></span> Puțini</p>
                <p><span style="background: #FFA500; width: 20px; height: 20px; display: inline-block; border: 1px solid #000;"></span> Mediu</p>
                <p><span style="background: #FF6347; width: 20px; height: 20px; display: inline-block; border: 1px solid #000;"></span> Mulți</p>
                <p><span style="background: #8B0000; width: 20px; height: 20px; display: inline-block; border: 1px solid #000;"></span> Foarte Mulți</p>
            `;
            return div;
        };

        legend.addTo(mapInstance);
    }
}