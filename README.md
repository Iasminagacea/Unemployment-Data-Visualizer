# UnD (Unemployment Data Visualizer)

Acesta este un instrument Web dezvoltat pentru prelucrarea și gestionarea datelor publice referitoare la șomajul din România, pe baza seturilor de date furnizate de ANOFM. 

Proiect realizat pentru disciplina Tehnologii Web.

## Funcționalități Implementate
* **Autentificare Administrator:** Sistem securizat de login pe bază de sesiuni PHP.
* **Modul de Import Date:** Încărcarea simultană a 4 fișiere CSV (General, Mediu, Vârstă, Educație).
* **Procesare Inteligentă CSV:** Detectare automată a delimitatorului (virgulă sau punct-și-virgulă), curățarea numerelor și normalizarea numelor de județe.
* **Bază de Date (Upsert):** Salvarea datelor în PostgreSQL cu prevenirea duplicatelor pe baza cheii `(an, luna, judet)`.
* **API de Extragere:** Endpoint RESTful (`get_data.php`) pentru interogarea asincronă a datelor.
* **Interfață Publică (Frontend):** Pagină responsivă pentru vizualizarea datelor.
* **Filtrare Dinamică:** Filtre interactive dependente (lunile se actualizează în funcție de anul selectat) și filtrare la nivel de județ.

## Tehnologii Utilizate
* **Frontend:** HTML, CSS (CSS Grid, Flexbox, Media Queries), JavaScript (Vanilla, Fetch API)
* **Backend:** PHP pur (Sesiuni, PDO)
* **Bază de date:** PostgreSQL
* **Arhitectură:** Client-Server, fără utilizarea vreunui framework (conform specificațiilor).

## Structura Proiectului
```text
Unemployment-Data-Visualizer/
├── frontend/
│   ├── login.html       # Interfața de autentificare pentru administrator
│   ├── admin.html       # Modulul de import pentru datele CSV (protejat)
│   └── index.html       # Interfața publică cu filtre dinamice și pregătită pentru grafice
├── backend/
│   ├── db/
│   │   ├── Database.php # Clasa de conexiune securizată (PDO) la PostgreSQL
│   │   ├── env.ini      # Fișier cu variabile de mediu (Ignorat de Git)
│   │   └── .htaccess    # Protecție pentru a bloca accesul public la env.ini
│   └── api/
│       ├── login.php      # Verificarea credențialelor și inițializarea sesiunii
│       ├── check_auth.php # Validarea sesiunii active (protecție rută admin)
│       ├── import.php     # Procesarea, combinarea și inserarea inteligentă a CSV-urilor
│       └── get_data.php   # API-ul care returnează datele din BD în format JSON
└── README.md