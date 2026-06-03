var info = document.getElementById('info');
var tbl = document.getElementById('tbl');
const colsSelected = new Set();  // ← was colsSelected !!! cols -> rows!
var newRow = [];
makeSelectAllButton();

function makeTable(tableData) {
    colsSelected.clear();
    var table = document.createElement('table');
    table.classList.add("table", "table-striped");
    table.setAttribute("id", "table-1");
    var tableBody = document.createElement('tbody');

    tableData.forEach(function (rowData, rowIndex) {
        var row = document.createElement('tr');

        rowData.forEach(function (cellData, cellIndex) {
            var cell = document.createElement('td');

            // Header row: first row, skip 'index' cell
            if (rowIndex === 0) {
                cell.appendChild(document.createTextNode(cellData === 'index' ? '' : cellData));
            }
            // First cell of data rows → row header with controls
            else if (cellIndex === 0) {
                makeRowHeader(cellData, cell, table, rowIndex);
            } else {
                cell.appendChild(document.createTextNode(cellData));
            }

            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    tbl.innerHTML = '';
    tbl.appendChild(table);
}

function makeSelectAllButton() {
    var bAll = document.getElementById('toggle-all');
    bAll.addEventListener('click', () => toggleAll());
}

// Controls go in first cell of each DATA row
function makeRowHeader(text, cell, table, rowIndex) {
    const colorPick = document.createElement("input");
    colorPick.setAttribute("type", "color");
    colorPick.style.display = "none";

    const colorBtn = document.createElement("button");
    colorBtn.textContent = "pick color";
    colorBtn.setAttribute("class", "colorBtn input-text");
    colorBtn.style.marginRight = "5px";

    const inputText = document.createElement("input");
    inputText.setAttribute("type", "text");
    inputText.setAttribute("class", "sampleLabel input-text");
    inputText.setAttribute("value", text);

    const selectThis = document.createElement("button");
    selectThis.textContent = 'this';
    selectThis.setAttribute("class", "btn aqua select-this");

    const selectSame = document.createElement("button");
    selectSame.textContent = 'same labels';
    selectSame.setAttribute("class", "btn aqua select-same");

    cell.appendChild(colorBtn);
    cell.appendChild(colorPick);
    cell.appendChild(document.createTextNode("variant name (select/change): "));
    cell.appendChild(inputText);
    cell.appendChild(document.createTextNode("select"));
    cell.appendChild(selectThis);
    cell.appendChild(selectSame);

    colorBtn.addEventListener('click', () => colorPick.click());
    selectThis.addEventListener('click', () => toggleRow(rowIndex, table));
    inputText.addEventListener('click', () => toggleRow(rowIndex, table));
    inputText.addEventListener('change', () => batchRename(inputText.value, table));
    selectSame.addEventListener('click', () => selectAllSame(inputText.value, table));

    colorPick.addEventListener('input', () => {
        colors[rowIndex] = colorPick.value;
        colorBtn.style.backgroundColor = colorPick.value;
        colorBtn.textContent = "Color selected!";
    });
}

function toggleRow(rowIndex, table) {
    if (colsSelected.has(rowIndex)) colsSelected.delete(rowIndex);
    else colsSelected.add(rowIndex);
    updateRowHighlight(table);
}

function batchRename(newName, table) {
    colsSelected.forEach(idx => {
        tableData[idx][0] = newName;
        const inputField = table.rows[idx].cells[0].querySelector('input.sampleLabel');
        if (inputField) inputField.value = newName;
    });

    colsSelected.clear();
    updateRowHighlight(document.getElementById('table-1'));
}

function selectAllSame(label, table) {
    colsSelected.clear();
    document.querySelectorAll('.sampleLabel').forEach((x, i) => {
        if (x.value === label) colsSelected.add(i + 1); // +1: skip header row
    });
    updateRowHighlight(table);
}

function updateRowHighlight(table) {
    Array.from(table.rows).forEach((row, idx) => {
        row.style.backgroundColor = colsSelected.has(idx) ? "rgba(190,110,40,0.28)" : "";
    });
}

function toggleAll() {
    const table = document.getElementById('table-1');
    const totalRows = table.rows.length;
    if (((colsSelected.size > totalRows/2 - 1) && (colsSelected.size < totalRows - 1)) || (colsSelected.size == 0)) { 
        for (let i = 1; i < totalRows; i++) colsSelected.add(i); // skip header row 0
    } else {
        colsSelected.clear();
    }
    updateRowHighlight(table);
}

function makeAverage(protocol) {
    if (colsSelected.size === 0) { alert('Error! Row(s) not selected!'); return; }
    const table = document.getElementById("table-1");
    const totalCols = table.rows[0].cells.length;
    const label = document.getElementById('label').value;

    // Build averaged row data
    const newRowData = [label];
    for (let c = 1; c < totalCols; c++) {
        let sum = 0;
        colsSelected.forEach(rowIdx => {
            sum += parseFloat(table.rows[rowIdx].cells[c].textContent) || 0;
        });
        newRowData.push(sum / colsSelected.size);
    }

    // Append to tableData
    tableData.push(newRowData);

    // Append to DOM
    const newTr = document.createElement('tr');
    newRowData.forEach((val, c) => {
        const cell = document.createElement('td');
        if (c === 0) {
            makeRowHeader(val, cell, table, table.rows.length); // rowIndex = new last row
        } else {
            cell.appendChild(document.createTextNode(val));
        }
        newTr.appendChild(cell);
    });
    table.querySelector('tbody').appendChild(newTr);

    colsSelected.clear();
    updateRowHighlight(table);
}

function sortAlphabetically() {
    var coll = new Intl.Collator('en', { numeric: false, sensitivity: 'base' });
    var t1 = tableData.shift(); // header row
    tableData.sort((a, b) => coll.compare(a[0], b[0]));
    tableData.unshift(t1);
    makeTable(tableData);
}
