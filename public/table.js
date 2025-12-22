var info = document.getElementById('info');
var tbl = document.getElementById('tbl');
var columnIndex = 0;
const colsSelected = new Set();
var newCol = [];

// Функция за създаване на таблица
function makeTable(tableData) {
    colsSelected.clear(); // reset selection
    var table = document.createElement('table');
    table.classList.add("table", "table-striped");
    table.setAttribute("id", "table-1");
    var tableBody = document.createElement('tbody');

    tableData.forEach(function (rowData, rowIndex) {
        var row = document.createElement('tr');

        rowData.forEach(function (cellData, cellIndex) {
            var cell = document.createElement('td');

            if (rowIndex === 0 && cellData === 'index') {
                makeSelectAllButton(cell, table);
            } else {
                if (rowIndex === 0 && cellIndex !== 0) {
                    makeColumnHeader(cellData, cell, table, cellIndex);
                } else {
                    cell.appendChild(document.createTextNode(cellData));
                }
            }

            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    tbl.innerHTML = '';
    tbl.appendChild(table);
}

// Бутон Select / Deselect All
function makeSelectAllButton(cell, table) {
    var bAll = document.getElementById('toggle-all');
    //bAll.setAttribute('id', 'toggle-all-btn');
    //bAll.innerHTML = 'select / deselect All';
    //bAll.style.margin = '5px';
    bAll.addEventListener('click', () => toggleAll(table));
    //cell.appendChild(bAll);
}

// Header с бутон за цвят и текстово поле
function makeColumnHeader(text, cell, table, colIndex) {
    // Скрит color input
    const colorPick = document.createElement("input");
    colorPick.setAttribute("type", "color");
    colorPick.style.display = "none"; // скрито поле

    // Бутон за избор на цвят
    const colorBtn = document.createElement("button");
    colorBtn.textContent = "pick color";
    colorBtn.setAttribute("class", "colorBtn");
    colorBtn.style.marginRight = "5px";

    // Текстово поле за имената на колоните
    const inputText = document.createElement("input");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("class", "sampleLabel");
    inputText.setAttribute("value", text);

    // Добавяне на елементи към клетката
    //cell.appendChild(document.createTextNode(""));
    cell.appendChild(colorBtn);
    cell.appendChild(colorPick);
    cell.appendChild(document.createElement("br"));
    cell.appendChild(document.createTextNode("variant name (change): "));
    cell.appendChild(inputText);
    cell.appendChild(document.createElement("br"));

    // Click върху бутона отваря color picker
    colorBtn.addEventListener('click', () => colorPick.click());

    // При избор на цвят - оцветяване на бутона и запис в colors
    colorPick.addEventListener('input', () => {
        colors[colIndex] = colorPick.value;
        colorBtn.style.backgroundColor = colorPick.value;
        colorBtn.textContent = "Color selected!";
    });

    // Click върху клетката за селекция
    cell.addEventListener('click', () => toggleColumn(colIndex, table));

    // Batch rename
    inputText.addEventListener('change', () => batchRename(inputText.value, table));
}

// Toggle за една колона
function toggleColumn(colIndex, table) {
    if (colsSelected.has(colIndex)) colsSelected.delete(colIndex);
    else colsSelected.add(colIndex);
    updateColumnHighlight(table);
}

// Batch rename
function batchRename(newName, table) {
    colsSelected.forEach(idx => {
        tableData[idx][0] = newName;
        const inputField = table.rows[0].cells[idx].querySelector('input.sampleLabel');
        if (inputField) inputField.value = newName;
    });
}

// Highlight на селектираните колони
function updateColumnHighlight(table) {
    Array.from(table.rows).forEach(row => {
        Array.from(row.cells).forEach((cell, idx) => {
            cell.style.backgroundColor = colsSelected.has(idx) ? "lightgreen" : "";
        });
    });
}

// Select / Deselect All
function toggleAll(table) {
    const totalCols = table.rows[0].cells.length;
    if (colsSelected.size < totalCols - 1) { // пропускаме първата колона с бутона
        for (let i = 1; i < totalCols; i++) colsSelected.add(i);
    } else {
        colsSelected.clear();
    }
    updateColumnHighlight(table);
}

// Изчисляване на average
function makeAverage(protocol) {
    if (colsSelected.size === 0) { alert('Error! Column(s) not selected!'); return; }
    const table = document.getElementById("table-1"); 
    newCol = [];

    Array.from(table.rows).forEach(row => {
        let averaged = 0;
        colsSelected.forEach(selectedIndex => {
            const selectedNumber = row.cells[selectedIndex].textContent;
            averaged += parseFloat(selectedNumber);
        });
        averaged = averaged / colsSelected.size;

        const label = document.getElementById('label').value;
        if (row.rowIndex === 0) newCol.push(label);
        else if (row.rowIndex === 2) newCol.push(protocol);
        else newCol.push(averaged);

        const cell = document.createElement('td');
        if (row.rowIndex === 0) {
            makeColumnHeader(label, cell, table, row.cells.length);
        } else {
            cell.appendChild(document.createTextNode(averaged));
        }
        row.appendChild(cell);
    });

    tableData.push(newCol);
    toggleAll(table); // автоматично select/deselect на новата колона
}
