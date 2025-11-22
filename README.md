# Fluo App Online

**Authors:** M. Kolaksazov, PhD; ChatGPT
**Year:** 2024  
**License:** Free to use and copy

**Online:** [fluo-app-online](https://fluo-app-online.onrender.com/)  
**Previous demo link:** [GitHub Pages](https://mkolaksazov.github.io/Telerik-Academy/JavaScript/csv_tool/public/index.html)

---

## Description
Fluo App Online is a web application for extracting, processing, and analyzing experimental fluorescent data.  
The application works with CSV or TXT files and allows:

- Selecting columns and rows of data
- Selecting protocols for the FluorPen 110 (PSI, Czech Republic) fluorometer: OJIP, NPQ1, NPQ2, NPQ3
- Plotting transient OJIP and NPQ curves
- Calculating averages of selected columns and assigning new sample names
- Calculating OJIP and NPQ parameters and plotting corresponding graphs
- Saving processed columns as CSV files
- Graphs implemented using Chart.js

---

## Main Features

1. **File Upload**  
   - Supports CSV, TXT, TSV files.  
   - Automatically detects column separators (tab, comma, semicolon) and decimal delimiter.  
   - Protocol selection: OJIP, NPQ1, NPQ2, NPQ3.

2. **Table Manipulation**  
   - Reordering columns, renaming, and averaging values.  
   - Large "select/deselect all" button for columns.  
   - Each column has a color picker and a text field for title editing.

3. **Graphs**  
   - **Transient (OJIP/NPQ)** – logarithmic axis for OJIP, linear for NPQ.  
   - **Bar/Line Graphs** – display selected parameters as simple bars or scatter points.  
   - **Boxplot** – Tukey HSD pairwise test for statistical significance (p ≤ 0.05). Requires at least two repetitions per variant with identical column names.

4. **Average & Rename**  
   - Calculates the average of the selected columns (both transient data and parameters).  
   - Assigns a new name to the resulting column.

5. **CSV Export**  
   - Exports selected columns in the order they were selected.  
   - Password required for full functionality.  
   - CSV formatted with tab delimiter and "." as decimal separator.

---

## How to Use the App

1. Upload a CSV/TXT file and choose the correct delimiter.  
2. Select the protocol for the experimental data (default: OJIP).  
3. The table displays data: rows = time points/parameters, columns = experimental samples.  
4. Select columns for plotting or calculations. The order of selection determines the plotting order.  
5. Optionally, customize column color and title.  
6. Save/export: select columns and press "save". Enter password if required.  
7. Graphs:  
   - Transient – select columns and click "draw transient"  
   - Bar/Line – select parameter and click "draw bars / line"  
   - Boxplot – requires at least two repetitions per variant; select columns accordingly

---

## Environment Setup

- Database connection uses PostgreSQL or MySQL (depending on deployment).  
- Environment variables (example for PostgreSQL): 

```
PG_HOST=<host>
PG_USER=<username>
PG_PASS=<password>
PG_DB=<database>
PG_PORT=5432
```

- Example for MySQL:  

```
MYSQL_HOST=<host>
MYSQL_USER=<username>
MYSQL_PASS=<password>
MYSQL_DB=<database>
MYSQL_PORT=3306
```

---

## Changelog / Updates

- v1.0 — Initial release; supports CSV/TXT upload, OJIP/NPQ protocols, graph plotting, CSV export.  
- v1.1 — Added boxplot support with Tukey HSD; improved column selection UI.  
- v1.2 — PostgreSQL support added; improved error handling for CSV parsing and DB operations.  
- v1.3 — Deployment-ready setup for Render, environment variables handling.  

---

## Known Issues

- Boxplot requires consistent naming of repetitions; incorrect titles break the calculation.  
- Full version export requires password entry.  
- Large CSV files may cause delays in rendering graphs due to client-side processing.  
- Database connection requires proper environment configuration; cloud MySQL/PostgreSQL may need SSL setup.  

---

## Architecture & Technology

- **Front-end:** HTML, CSS, JS, Chart.js  
- **Back-end:** Node.js, Express.js  
- **Database:** MySQL or PostgreSQL (using pool connections, async/await)  
- **CSV Processing:** csv-parser, json2csv  
- **Deployment:** Render.com

---

## API

| Method | Path | Description |
|--------|------|------------|
| GET | `/api/data` | Returns all database entries |
| GET | `/api/:id/csv` | Returns CSV for a specific record |
| POST | `/api/upload-csv` | Uploads CSV, converts to JSON, and saves to database |
| DELETE | `/api/data/:id/csv` | Deletes a record from the database |

---

## Contact
M. Kolaksazov, PhD  
Email: m.kolaksazov@gmail.com
