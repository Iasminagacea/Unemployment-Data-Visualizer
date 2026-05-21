# UnD (Unemployment Data Visualizer)

Acesta este un instrument Web dezvoltat pentru prelucrarea și gestionarea datelor publice referitoare la șomajul din România, pe baza seturilor de date furnizate de ANOFM. 

Proiect realizat pentru disciplina Tehnologii Web.

## Funcționalități Implementate

### 1. Modul de Administrare și Arhitectură Bază de Date
* **Autentificare Administrator:** Sistem securizat de login pe bază de sesiuni PHP. Endpoint-ul de API (`check_auth.php`) previne accesul neautorizat la pagina de import.
* **Procesare Inteligentă CSV:** Modulul de import acceptă încărcarea simultană a 4 fișiere CSV (General, Mediu, Vârstă, Educație). Există o logică avansată pentru detectarea automată a delimitatorului (virgulă sau punct-și-virgulă), curățarea numerelor (eliminarea punctelor de mii) și normalizarea numelor de județe.
* **Bază de Date (Upsert):** Salvarea datelor în baza de date PostgreSQL folosind instrucțiuni preparate (PDO) cu prevenirea duplicatelor pe baza cheii compuse `(an, luna, judet)`.
* **API de Extragere:** Endpoint RESTful (`get_data.php`) pentru interogarea asincronă a datelor în funcție de anul, luna și județul selectat.

### 2. Interfață Publică (Frontend) și Filtrare
* **Design Responsiv:** Interfață construită folosind CSS Grid și Flexbox pentru adaptarea perfectă pe desktop și mobil.
* **Filtrare Dinamică:** Filtre interactive interdependente. Meniul drop-down pentru luni se actualizează dinamic prin JavaScript în funcție de anul selectat, iar utilizatorul poate filtra datele la nivel național sau pentru un județ specific.

### 3. Vizualizare și Comparare Multi-Criterială
Aplicația permite analiza șomajului prin 7 maniere de vizualizare:
* **Comparație Județe:** Bar Chart cu totalul șomerilor pe județ.
* **Distribuție Gen:** Pie Chart (Femei vs. Bărbați).
* **Mediu (Urban / Rural):** Doughnut Chart.
* **Nivel de Educație:** Bar Chart (7 categorii).
* **Grupe de Vârstă:** Bar Chart (6 grupe: <25, 25-29, 30-39, 40-49, 50-55, >55).
* **Evoluție în Timp:** Line Chart cu date istorice (luni/ani) via `get_evolution.php`.

### 4. Hartă Interactivă (Leaflet.js + OpenStreetMap)
* **42 Județe:** Cercuri color-coded cu gradient (verde → roșu) după densitatea șomajului.
* **Dimensiune Dinamică:** Raza cercului proporțională cu numărul de șomeri.
* **Pop-up-uri:** Click pe județ pentru a vedea statistici detaliate.
* **Integrare:** Actualizare automată pe schimbarea filtrelor (an/lună).

### 5. Export de Date (3 Formate)
* **CSV:** UTF-8 cu BOM pentru caractere românești, toate datele tabelului.
* **SVG:** Grafic vectorial scalabil (PNG embedded).
* **PDF:** A4 landscape cu tabele și paginare automată (jsPDF).
* **UI:** Buton "Export" în panelul de filtre cu selecție date și format.

### 6. Caching Stratificat
* **Backend:** File-based cache cu TTL 1 oră (CacheManager.php) pentru API responses.
* **Frontend:** localStorage pentru persistență date între sesiuni.
* **Performance:** Reducere semnificativă a query-urilor la bază.

## Tehnologii Utilizate
* **Frontend:** HTML5, CSS3 (Grid, Flexbox), Vanilla JavaScript, Chart.js (CDN), Leaflet.js (CDN).
* **Backend:** PHP pur (Sesiuni, PDO).
* **Bază de date:** PostgreSQL.
* **Caching:** File-based backend (1 oră TTL) + localStorage frontend.
* **Arhitectură:** Client-Server, fără framework, 100% API-based.

## Structura Proiectului
``````text
Unemployment-Data-Visualizer/
├── frontend/
│   ├── login.html          # Interfață login administrator
│   ├── admin.html          # Import CSV (protejat cu sesiune)
│   ├── index.html          # Interfață publică cu filtre și grafice
│   ├── charts.js           # Logică Chart.js (5 grafice)
│   ├── export.js           # Export CSV/SVG/PDF
│   ├── map.js              # Hartă Leaflet cu 42 județe
│   └── images/             # Resurse statice
├── backend/
│   ├── db/
│   │   ├── Database.php    # PDO connection class
│   │   ├── CacheManager.php# File-based caching (1h TTL)
│   │   ├── env.ini         # Credențiale DB și admin
│   │   └── .htaccess       # Protecție env.ini
│   ├── api/
│   │   ├── login.php       # Autentificare sesiune
│   │   ├── check_auth.php  # Validare sesiune
│   │   ├── import.php      # Procesare 4 CSV-uri
│   │   ├── get_data.php    # API date lună (cache)
│   │   └── get_evolution.php# API time-series (cache)
│   └── cache/              # Cache storage
└── README.md
``````
