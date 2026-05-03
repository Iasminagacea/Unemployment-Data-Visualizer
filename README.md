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

### 3. Vizualizare și Comparare Multi-Criterială (Chart.js)
Aplicația permite analiza șomajului prin multiple maniere de vizualizare:
* **Comparație Județe:** Bar Chart ce afișează numărul total de șomeri pentru fiecare județ.
* **Distribuție Gen:** Pie Chart ce prezintă proporția șomerilor (Femei vs. Bărbați).
* **Mediu (Urban / Rural):** Doughnut Chart pentru analiza distribuției pe medii de rezidență.
* **Nivel de Educație:** Bar Chart detaliat (Fără studii, Primar, Gimnazial, Liceal, Postliceal, Profesional, Universitar).
* **Grupe de Vârstă:** Bar Chart pentru segmentele de vârstă (< 25, 25-29, 30-39, 40-49, 50-55, > 55 ani).
* **Evoluție în Timp:** Line Chart integrat printr-un endpoint separat (`get_evolution.php`), care randează automat istoricul șomajului pe luni/ani (pentru județul selectat sau la nivel național).

## Tehnologii Utilizate
* **Frontend:** HTML5, CSS3 (variabile native, Grid, Flexbox), Vanilla JavaScript (Fetch API), Chart.js (prin CDN).
* **Backend:** PHP pur (Sesiuni, PDO).
* **Bază de date:** PostgreSQL.
* **Arhitectură:** Client-Server, fără utilizarea vreunui framework, conform specificațiilor proiectului.

## Structura Proiectului
```text
Unemployment-Data-Visualizer/
├── frontend/
│   ├── login.html       # Interfața de autentificare pentru administrator
│   ├── admin.html       # Modulul de import pentru datele CSV (protejat)
│   ├── index.html       # Interfața publică cu filtre dinamice și grafice
│   ├── charts.js        # Logica JavaScript pentru instanțierea și distrugerea graficelor (Chart.js)
│   └── images/          # Resurse statice (iconițe)
├── backend/
│   ├── db/
│   │   ├── Database.php # Clasa de conexiune securizată (PDO) la PostgreSQL
│   │   ├── env.ini      # Fișier cu credențialele de DB și Admin
│   │   └── .htaccess    # Protecție Apache pentru blocarea accesului la env.ini
│   └── api/
│       ├── login.php          # Verificarea credențialelor și inițializarea sesiunii
│       ├── check_auth.php     # Validarea sesiunii active (protecție rută admin)
│       ├── import.php         # Procesarea și combinarea celor 4 CSV-uri
│       ├── get_data.php       # Endpoint API pentru statistici specifice unei luni
│       └── get_evolution.php  # Endpoint API pentru extragerea datelor istorice în format Time-Series
└── README.md