var info = document.getElementById('info');
var tbl = document.getElementById('tbl');
var columnIndex = 0;
const colsSelected = new Set();
var newCol = [];
makeSelectAllButton();

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
                //makeSelectAllButton(table);
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
function makeSelectAllButton() {
    var bAll = document.getElementById('toggle-all');
    bAll.addEventListener('click', () => toggleAll());
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
    colorBtn.setAttribute("class", "colorBtn form-control");
    colorBtn.style.marginRight = "5px";

    // Текстово поле за имената на колоните
    const inputText = document.createElement("input");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("class", "sampleLabel input-text");
    inputText.setAttribute("value", text);

    // Текстово поле за чекбокс
    const selectThis = document.createElement("button");
    selectThis.textContent = 'this';
    selectThis.setAttribute("class", "btn aqua select-this")

    // Текстово поле за чекбокс
    const selectSame = document.createElement("button");
    selectSame.textContent = 'same labels';
    selectSame.setAttribute("class", "btn aqua select-same")

    // Добавяне на елементи към клетката
    //cell.appendChild(document.createTextNode(""));
    cell.appendChild(colorBtn);
    cell.appendChild(colorPick);
    cell.appendChild(document.createElement("br"));
    cell.appendChild(document.createTextNode("variant name (select/change): "));
    cell.appendChild(inputText);
    cell.appendChild(document.createElement("br"));
    cell.appendChild(document.createTextNode("select"));
    cell.appendChild(selectThis);
    cell.appendChild(selectSame);
    cell.appendChild(document.createElement("br"));

    colorBtn.addEventListener('click', () => colorPick.click());
    selectThis.addEventListener('click', () => toggleColumn(colIndex, table));
    inputText.addEventListener('click', () => toggleColumn(colIndex, table));
    inputText.addEventListener('change', () => batchRename(inputText.value, table));
    selectSame.addEventListener('click', () => selectAllSame(inputText.value, table));

    // При избор на цвят - оцветяване на бутона и запис в colors
    colorPick.addEventListener('input', () => {
        colors[colIndex] = colorPick.value;
        colorBtn.style.backgroundColor = colorPick.value;
        colorBtn.textContent = "Color selected!";
    });
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

// Select all same labels
function selectAllSame(label, table) {
    colsSelected.clear();
    document.querySelectorAll('.sampleLabel').forEach((x, i) => { if (x.value == label) { colsSelected.add(i+1); } })
    updateColumnHighlight(table);
}

// Highlight на селектираните колони
function updateColumnHighlight(table) {
    Array.from(table.rows).forEach(row => {
        Array.from(row.cells).forEach((cell, idx) => {
            cell.style.backgroundColor = colsSelected.has(idx) ? "rgba(190,110,40,0.28)" : "";
        });
    });
}

// Select / Deselect All
function toggleAll() {
    //const totalCols = table.rows[0].cells.length;
    const table = document.getElementById('table-1');
    const totalCols = table.childNodes[0].childNodes[0].children.length;
    if (((colsSelected.size > totalCols/2 - 1) && (colsSelected.size < totalCols - 1)) || (colsSelected.size == 0)) { // пропускаме първата колона с бутона
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
    colsSelected.clear();
    updateColumnHighlight(table);
    // toggleAll(); // автоматично select/deselect на новата колона
}
