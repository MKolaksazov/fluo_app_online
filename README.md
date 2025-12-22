# Fluo App Online

**Authors:** M. Kolaksazov, PhD; ChatGPT
**Year:** 2024
**License:** Free to use and copy

**Online:** [fluo-app-online](https://fluo-app-online.onrender.com/)
**Previous demo link:** [GitHub Pages](https://mkolaksazov.github.io/Telerik-Academy/JavaScript/csv_tool/public/index.html)

---

## Description

Fluo App Online is a web application designed for extracting, processing, and analyzing experimental fluorescent data, compatible with CSV and TXT files. It allows users to select data columns and rows, apply experimental protocols for the FluorPen 110 (PSI, Czech Republic), plot transient OJIP and NPQ curves, compute averages, calculate OJIP and NPQ parameters, and export processed data.

The CSV upload system has been updated to improve stability when inserting large datasets into the database; the system can handle a high number of columns before reaching client-side or backend limits.

---

## Main Features

1. **File Upload**

   * Supports CSV, TXT, TSV.
   * Automatically detects separators and decimal delimiters.
   * Protocol selection: OJIP, NPQ1, NPQ2, NPQ3.
   * **Updated CSV upload system:** improved stability and database integration for large datasets.

2. **Table Manipulation**

   * Column reordering, renaming, averaging.
   * Large "select/deselect all" button.
   * Color picker and editable title per column.
   * **Batch renaming:** when multiple columns are selected, entering a new name in the text field of any selected column updates all selected columns simultaneously. This ensures boxplot statistics and other analyses that rely on consistent column naming function correctly.

3. **Graphs**

   * Transient curves (logarithmic axis for OJIP, linear for NPQ).
   * Bar/line graphs for selected parameters.
   * Boxplots with Tukey HSD pairwise tests (p ≤ 0.05), requiring at least two repetitions per variant. Batch renaming is necessary for correct statistical computation.

4. **Average & Rename**

   * Compute averages for selected columns.
   * Assign new names to resulting columns.

5. **CSV Export**

   * Exports columns in selection order.
   * Password-protected full functionality.
   * Tab-delimited CSV with "." as decimal separator.

---

## How to Use

1. Upload CSV/TXT and select delimiter.
2. Choose protocol (default: OJIP).
3. Table shows rows as time points/parameters, columns as samples.
4. Select columns for plotting/calculation; selection order determines graph order.
5. Customize column color/title if desired. **Renaming multiple columns:** typing a name in one of the text fields for a selected column applies it to all selected columns; this ensures that boxplot and statistical analyses function properly.
6. Save/export selected columns; enter password if required.
7. Graph plotting:

   * Transient: select columns → "Draw Transient".
   * Bar/Line: select parameter → "Draw Bars/Line".
   * Boxplot: requires ≥2 repetitions per variant.

---

## Environment Setup

* Database: PostgreSQL or MySQL.
* Environment variables example (PostgreSQL):

```
PG_HOST=<host>
PG_USER=<username>
PG_PASS=<password>
PG_DB=<database>
PG_PORT=5432
```

* Example (MySQL):

```
MYSQL_HOST=<host>
MYSQL_USER=<username>
MYSQL_PASS=<password>
MYSQL_DB=<database>
MYSQL_PORT=3306
```

---

## Changelog

* **v1.0** – Initial release, CSV/TXT upload, OJIP/NPQ protocols, graphs, CSV export.
* **v1.1** – Added boxplot with Tukey HSD, improved column UI.
* **v1.2** – PostgreSQL support, improved CSV parsing/DB error handling.
* **v1.3** – Deployment-ready, environment variables support.
* **v1.4** – Added batch renaming of selected columns for consistent naming; updated CSV upload system for larger datasets.

---

## Known Issues

* Boxplot requires consistent repetition names; batch renaming ensures correct statistical analysis.
* Full CSV export needs password.
* Large CSV files may slow client-side graph rendering.
* Database connections require correct environment configuration; cloud DB may need SSL.

---

## Architecture & Technology

* **Frontend:** HTML, CSS, JS, Chart.js
* **Backend:** Node.js, Express.js
* **Database:** MySQL/PostgreSQL, pooled async connections
* **CSV Processing:** csv-parser, json2csv
* **Deployment:** Render.com

---

## API

| Method | Path                | Description                          |
| ------ | ------------------- | ------------------------------------ |
| GET    | `/api/data`         | Fetch all database entries           |
| GET    | `/api/:id/csv`      | Fetch CSV for specific record        |
| POST   | `/api/upload-csv`   | Upload CSV → JSON → save to database |
| DELETE | `/api/data/:id/csv` | Delete record from database          |

---

## Contact

M. Kolaksazov, PhD
Email: [m.kolaksazov@gmail.com](mailto:m.kolaksazov@gmail.com)
