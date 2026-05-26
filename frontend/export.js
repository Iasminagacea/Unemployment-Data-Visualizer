function exportToCSV(dateSomeri, anul, luna) {
    if (!dateSomeri || dateSomeri.length === 0) {
        alert("Nu sunt date pentru export!");
        return;
    }

    let csv = "Județ,Total Șomeri,Femei,Bărbați,Urban,Rural,Sub 25,25-29,30-39,40-49,50-55,Peste 55,Fără Studii,Primar,Gimnazial,Liceal,Postliceal,Profesional,Universitar\n";

    dateSomeri.forEach(row => {
        csv += `"${row.judet}",${row.total_someri},${row.someri_femei},${row.someri_barbati},${row.someri_urban},${row.someri_rural},${row.varsta_sub_25},${row.varsta_25_29},${row.varsta_30_39},${row.varsta_40_49},${row.varsta_50_55},${row.varsta_peste_55},${row.edu_fara_studii},${row.edu_primar},${row.edu_gimnazial},${row.edu_liceal},${row.edu_postliceal},${row.edu_profesional},${row.edu_universitar}\n`;
    });

    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csv;

    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `somaj_${anul}_${luna}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportChartToSVG(chartId, fileName) {
    const canvas = document.getElementById(chartId);
    if (!canvas) {
        alert("Nu se găsește graficul!");
        return;
    }

    const image = canvas.toDataURL('image/png');

    const width = canvas.width;
    const height = canvas.height;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
        <style type="text/css">
            <![CDATA[
                text { font-family: Arial, Helvetica, sans-serif; }
                .chart-title { font-size: 16px; font-weight: bold; }
            ]]>
        </style>
    </defs>
    <rect width="${width}" height="${height}" fill="white" stroke="none"/>
    <image width="${width}" height="${height}" xlink:href="${image}"/>
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.svg`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 100);
}

async function exportToPDF(dateSomeri, anul, luna) {
    if (!dateSomeri || dateSomeri.length === 0) {
        alert("Nu sunt date pentru export!");
        return;
    }

    const btn = document.getElementById('btnConfirmExport');
    const originalText = btn.textContent;
    btn.textContent = "Se generează...";
    btn.disabled = true;

    try {
        console.log("Incerc sa incarc jsPDF...");
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
        console.log("jsPDF incarcat cu succes!");

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Titlu
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('Raport Somaj', 15, 20);

        // Info
        doc.setFontSize(11);
        doc.setFont(undefined, 'normal');
        doc.text(`Luna: ${luna}/${anul}`, 15, 30);
        doc.text(`Total judete: ${dateSomeri.length}`, 15, 37);

        // Statistici generale
        let totalSomeri = 0;
        let totalFemei = 0;
        let totalBarbati = 0;
        let totalUrban = 0;
        let totalRural = 0;

        dateSomeri.forEach(d => {
            totalSomeri += parseInt(d.total_someri) || 0;
            totalFemei += parseInt(d.someri_femei) || 0;
            totalBarbati += parseInt(d.someri_barbati) || 0;
            totalUrban += parseInt(d.someri_urban) || 0;
            totalRural += parseInt(d.someri_rural) || 0;
        });

        doc.setFontSize(10);
        doc.text(`Total Someri: ${totalSomeri}`, 15, 45);
        doc.text(`Femei: ${totalFemei} | Barbati: ${totalBarbati}`, 15, 51);
        doc.text(`Urban: ${totalUrban} | Rural: ${totalRural}`, 15, 57);

        // Tabel simplu cu linii
        doc.setFontSize(8);
        let y = 70;
        const col1 = 15; // Județ
        const col2 = 60; // Total
        const col3 = 100; // Femei
        const col4 = 140; // Bărbați
        const col5 = 180; // Urban
        const col6 = 220; // Rural
        const rowHeight = 6;

        // Headere
        doc.setFont(undefined, 'bold');
        doc.setFillColor(37, 99, 235);
        doc.setTextColor(255, 255, 255);
        doc.rect(col1, y, 40, rowHeight, 'F');
        doc.rect(col2, y, 35, rowHeight, 'F');
        doc.rect(col3, y, 35, rowHeight, 'F');
        doc.rect(col4, y, 35, rowHeight, 'F');
        doc.rect(col5, y, 35, rowHeight, 'F');
        doc.rect(col6, y, 35, rowHeight, 'F');

        doc.text('Judet', col1 + 2, y + 4);
        doc.text('Total', col2 + 2, y + 4);
        doc.text('Femei', col3 + 2, y + 4);
        doc.text('Barbati', col4 + 2, y + 4);
        doc.text('Urban', col5 + 2, y + 4);
        doc.text('Rural', col6 + 2, y + 4);

        y += rowHeight;

        // Linii
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        dateSomeri.forEach((d, idx) => {
            if (y > 270) {
                doc.addPage();
                y = 15;
            }

            const bgColor = idx % 2 === 0 ? 242 : 255;
            doc.setFillColor(bgColor, bgColor, bgColor);

            doc.rect(col1, y, 40, rowHeight, 'F');
            doc.rect(col2, y, 35, rowHeight, 'F');
            doc.rect(col3, y, 35, rowHeight, 'F');
            doc.rect(col4, y, 35, rowHeight, 'F');
            doc.rect(col5, y, 35, rowHeight, 'F');
            doc.rect(col6, y, 35, rowHeight, 'F');

            // Linii
            doc.setDrawColor(200);
            doc.line(col1, y + rowHeight, col6 + 35, y + rowHeight);

            // Text
            doc.text(d.judet.substring(0, 12), col1 + 2, y + 4);
            doc.text((d.total_someri || 0).toString(), col2 + 2, y + 4);
            doc.text((d.someri_femei || 0).toString(), col3 + 2, y + 4);
            doc.text((d.someri_barbati || 0).toString(), col4 + 2, y + 4);
            doc.text((d.someri_urban || 0).toString(), col5 + 2, y + 4);
            doc.text((d.someri_rural || 0).toString(), col6 + 2, y + 4);

            y += rowHeight;
        });

        doc.save(`somaj_${anul}_${luna}.pdf`);
        alert("PDF generat cu succes!");

    } catch (error) {
        console.error("Eroare la export PDF:", error);
        console.error("Stack:", error.stack);
        alert(`Eroare la generarea PDF: ${error.message}\n\n`);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (src.includes('jspdf.umd') && window.jspdf) {
            resolve();
            return;
        }
        if (src.includes('autotable') && window.jspdf && window.jspdf.autoTable) {
            resolve();
            return;
        }

        const existing = Array.from(document.scripts).find(s => s.src === src);
        if (existing) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = true;

        let timeoutId;

        script.onload = () => {
            clearTimeout(timeoutId);
            resolve();
        };

        script.onerror = () => {
            clearTimeout(timeoutId);
            reject(new Error(`Failed to load ${src}`));
        };

        timeoutId = setTimeout(() => {
            reject(new Error(`Timeout loading ${src}`));
        }, 10000);

        document.head.appendChild(script);
    });
}

function getCachedData(key) {
    const cached = localStorage.getItem(key);
    if (cached) {
        const data = JSON.parse(cached);
        if (Date.now() - data.timestamp < 3600000) {
            return data.value;
        }
        localStorage.removeItem(key);
    }
    return null;
}

function setCachedData(key, value) {
    localStorage.setItem(key, JSON.stringify({
        value: value,
        timestamp: Date.now()
    }));
}