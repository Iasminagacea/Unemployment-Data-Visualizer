# UnD (Unemployment Data Visualizer)

Acesta este un instrument Web dezvoltat pentru prelucrarea și gestionarea datelor publice referitoare la șomajul din România, pe baza seturilor de date furnizate de ANOFM. 

Proiect realizat pentru disciplina Tehnologii Web.

## Tehnologii Utilizate
* **Frontend:** HTML, CSS, JavaScript (Vanilla, Fetch API)
* **Backend:** PHP pur (Sesiuni, PDO)
* **Bază de date:** PostgreSQL
* **Arhitectură:** Client-Server, fără utilizarea vreunui framework (conform specificațiilor).

## Structura Proiectului
```text
Unemployment-Data-Visualizer/
├── frontend/
│   ├── login.html       # Interfața de autentificare pentru administrator
│   └── admin.html       # Modulul de import pentru datele CSV (protejat)
├── backend/
│   ├── db/
│   │   ├── Database.php # Clasa de conexiune securizată (PDO) la PostgreSQL
│   │   ├── test_db.php  # Script de testare a conexiunii la BD
│   │   ├── env.ini      # Fișier cu variabile de mediu (Ignorat de Git)
│   │   └── .htaccess    # Protecție pentru a bloca accesul public la env.ini
│   └── api/
│       ├── login.php      # Verificarea credențialelor și inițializarea sesiunii
│       ├── check_auth.php # Validarea sesiunii active (protecție rută admin)
│       └── import.php     # Procesarea, combinarea și inserarea fișierelor CSV
└── README.md