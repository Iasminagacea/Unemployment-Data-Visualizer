# UnD (Unemployment Data Visualizer)

This is a Web tool developed for processing and managing public data related to unemployment in Romania, based on datasets provided by ANOFM. 

Project created for the Web Technologies course.

**The demonstration video is available at:** https://www.loom.com/share/49fdb79dda1a4709a9ebafeb6f521c6a

## Implemented Features

### 1. Admin Module and Database Architecture
* **Admin Authentication:** Secure login system based on PHP sessions. The API endpoint (`check_auth.php`) prevents unauthorized access to the import page. Logout protected with a confirmation dialog.
* **Smart CSV Processing:** The import module supports the simultaneous upload of 4 CSV files (General, Environment, Age, Education). Advanced logic is in place for:
  - Automatic delimiter detection (comma or semicolon)
  - Number cleaning (removing thousands separators)
  - Normalization of county names
  - **CSV Structure Validation:** Header verification to prevent accidental file uploads in incorrect slots
* **Database (Upsert):** Saving data into the PostgreSQL database using prepared statements (PDO) with duplicate prevention based on the composite key `(an, luna, judet)`.
* **Extraction API:** RESTful endpoints for asynchronous data querying based on the selected year, month, and county.

### 2. Public Interface (Frontend) and Filtering
* **Responsive Design:** Interface built using CSS Grid and Flexbox for perfect adaptation on desktop and mobile devices.
* **Dynamic Filtering:** Interdependent interactive filters. The drop-down menu for months updates dynamically via JavaScript based on the selected year, and the user can filter data at a national level or for a specific county.

### 3. Multi-Criteria Visualization and Comparison
The application allows unemployment analysis through **7 visualization methods:**
* **County Comparison:** Bar Chart showing total unemployed individuals per county.
* **Gender Distribution:** Pie Chart (Women vs. Men).
* **Environment (Urban / Rural):** Doughnut Chart.
* **Education Level:** Bar Chart (7 categories).
* **Age Groups:** Bar Chart (6 groups: <25, 25-29, 30-39, 40-49, 50-55, >55).
* **Evolution over Time:** Line Chart with historical data (months/years).

### 4. Interactive Map (Leaflet.js + OpenStreetMap)
* **42 Counties:** Color-coded circles with a gradient (green → red) based on unemployment density.
* **Dynamic Sizing:** Circle radius proportional to the number of unemployed individuals.
* **Pop-ups:** Click on a county to view detailed statistics.
* **Integration:** Automatic update upon changing filters (year/month).

### 5. Data and Chart Export
* **Charts:** 6 types exportable to SVG (counties, gender, environment, education, age, evolution).
* **Data:** Export to CSV (UTF-8 with BOM) and PDF (A4 landscape).
* **Validation:** SVG for charts, CSV/PDF for data.

### 6. Layered Caching
* **Backend:** File-based cache with a 1-hour TTL (CacheManager.php) for API responses.
* **Frontend:** localStorage for data persistence between sessions.
* **Performance:** Significant reduction of database queries.

## API Endpoints
The application exposes 6 RESTful endpoints for full integration:
* **`login.php`** - Admin authentication with PHP session
* **`logout.php`** - Logout and session destruction
* **`check_auth.php`** - Validation of current user authentication
* **`import.php`** - Simultaneous processing and validation of 4 CSV files
* **`get_data.php`** - Data extraction for the selected month (with 1h cache)
* **`get_evolution.php`** - Time-series data extraction (with aggregation and 1h cache)

## Security Features
* **Authentication:** Secure PHP session system with validation on every protected page
* **SQL Injection Prevention:** All queries use prepared statements (PDO) with bound parameters
* **XSS (Cross-Site Scripting) Prevention:** - HTML escaping for map pop-ups (using the `escapeHtml()` function)
  - County input sanitization (removes special characters, regex validation)
  - Type casting for year/month (int validation on the backend)
* **CSV Validation:** Verification of CSV structure and headers to prevent import errors
* **File Protection:** The env.ini file (credentials) is protected via .htaccess
* **Error Handling:** Granular error management in PHP and JavaScript

## Technologies Used
* **Frontend:** HTML5, CSS3 (Grid, Flexbox), Vanilla JavaScript, Chart.js (CDN), Leaflet.js (CDN).
* **Backend:** Pure PHP (Sessions, PDO).
* **Database:** PostgreSQL.
* **Caching:** File-based backend (1-hour TTL) + frontend localStorage.
* **Architecture:** Client-Server, frameworkless, 100% API-based.

## Project Structure
```text
Unemployment-Data-Visualizer/
├── frontend/
│   ├── login.html          # Admin login interface
│   ├── admin.html          # CSV Import (session-protected)
│   ├── index.html          # Public interface with filters and charts
│   ├── charts.js           # Chart.js logic (6 charts)
│   ├── export.js           # SVG/CSV/PDF export
│   ├── map.js              # Leaflet map with 42 counties
│   └── images/             # Static assets
├── backend/
│   ├── db/
│   │   ├── Database.php    # PDO connection class
│   │   ├── CacheManager.php# File-based caching (1h TTL)
│   │   ├── env.ini         # DB and admin credentials
│   │   └── .htaccess       # env.ini protection
│   ├── api/
│   │   ├── login.php       # Session authentication
│   │   ├── logout.php      # Logout and session destruction
│   │   ├── check_auth.php  # Session validation
│   │   ├── import.php      # Simultaneous processing and validation of 4 CSVs
│   │   ├── get_data.php    # Month data API (1h cache)
│   │   └── get_evolution.php# Time-series API (1h cache)
│   └── cache/              # Cache storage
└── README.md
