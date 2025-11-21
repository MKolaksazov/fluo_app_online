//async function uploadCsv(){
document.getElementById("uploadCsv").addEventListener("click", async () => {
    var content = tableData;
    var fname = document.getElementById('export').value;
    filename=`${fname}.csv`;

    if (colsSelected.length > 0) { content = insertSelected(colsSelected); }
    content = transpose(content);

    var times = 5; while(times--) {
      content.unshift([ " " ]);
    }

    const csvText = arrayToCsv(content); //document.getElementById("csvTextArea");
    //const csvText = csvTextArea.trim(); // Взимане на стойността и премахване на излишни интервали
    // не ми е нужно, тъй като моят csv формат съдържа нарочно празни места

    if (!csvText) {
        alert("Моля, въведете CSV текст!");
        return;
    }
    
    // ⭐ 2. Името на файла вече не е налично, затова използваме генерично име или го питаме
    const fileName = (filename != "export.csv") ? filename : "manual_upload_" + new Date().toISOString() + ".csv"; 

    try {
        // ⭐ 3. Изпращане на заявката с директния CSV стринг
        const response = await fetch("/api/upload-csv", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Изпращаме генерично име и въведения CSV текст
            body: JSON.stringify({ csvName: fileName, csvText: csvText }) 
        });

        const result = await response.json();

        if (response.ok && result.status === "ok") {
            alert(`Данните са изпратени успешно! ID: ${result.id}, редове: ${result.rows}`);
        } else {
            // Обработка на 4xx/5xx статус кодове от бекенда
            alert(`Грешка при качването на CSV: ${result.message || 'Неизвестна грешка'}`);
        }

    } catch (err) {
        console.error("Грешка при връзката с бекенда:", err);
        alert("Грешка при връзката с бекенда.");
    }
});
//}

document.getElementById('loadData').addEventListener('click', async () => {
  const res = await fetch('/api/data/');
  const data = await res.json();
  const tbl = document.getElementById('tbl');
  var table = document.createElement('table');
  table.classList.add("table", "table-striped");
  tbl.appendChild(table);

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
  
  tbody.innerHTML = `</br><tr><th>name</th><th>date</th><th></th><th></th></tr>`;
  data.forEach(row => { tbody.innerHTML += `<tr id="r${row.id}" > <td>${row.filename || '(undefined)'}</td> <td>${row.created_at}</td> <td><button id="loadFile" onClick="loadFile('${row.id}')">Load file</button></td><td><button id="deleteFile" onClick="deleteFile('${row.id}')">Delete file</button></td> </tr>`; });
});

async function loadFile(id_db){ 
  //document.getElementById('loadFile').addEventListener('click', async () => {
    const res = await fetch('/api/data/'+id_db+'/csv');
    const data = await res.text();
    const table = document.getElementById('tbl');
  
    processCSV(data.replace(/"/g, ''));
  //});
}

function removeRow(idRow) {
  var currentRow = document.getElementById(idRow);
  currentRow.remove();
}

// Функция за изтриване на запис по ID
async function deleteFile(id_db) {
    if (!id_db) {
        alert("Грешка: Липсва ID на записа за изтриване.");
        return;
    }

    // ⭐ 1. Формиране на URL с ID-то
    const url = `/api/data/${id_db}/csv`; // Пример: /api/data/123

    try {
        // ⭐ 2. Изпращане на DELETE заявка
        const response = await fetch(url, {
            method: 'DELETE', // Използваме DELETE метод
            //headers: { "Content-Type": "application/json" },

            // За DELETE заявки, тялото (body) обикновено е празно
        });

        // 3. Обработка на отговора
        if (response.ok) {
            // Ако статусът е 200/204, изтриването е успешно
            alert(`Запис с ID ${id_db} е успешно изтрит.`);
            removeRow('r'+id_db);
            // Тук може да обновите таблицата или да презаредите страницата
        } else {
            // Четене на отговора за грешка
            const errorData = await response.json(); 
            alert(`Грешка при изтриването на запис ${id_db}: ${errorData.message || response.statusText}`);
        }

    } catch (err) {
        console.error('Грешка при връзката с бекенда:', err);
        alert('Грешка при връзката с бекенда.');
    }
}

// Пример за извикване (при клик на бутона)
// document.getElementById('deleteButton').addEventListener('click', () => {
//     const recordIdToDelete = 123; // Трябва да вземете това ID динамично
//     deleteRecord(recordIdToDelete);
// });

function processCSV(contents){
          var delimiter = document.getElementById('delimiter').value;
          var lines = contents.split("\n");
          var array = [];
          for (var i=0; i<lines.length; i++){
              if (delimiter == 'tab') { array[i] = lines[i].split("\t"); }
              else if (delimiter == ',') { array[i] = lines[i].split(","); }
              else { alert('Wrong delimiter!'); }
          }
          indexCol = array.map(x => x[0]);
          indexCol = indexCol.slice(5, 983);
          const startOJIP = indexCol.indexOf("21");
          const startNPQ1 = indexCol.indexOf("2443101");
          const startNPQ2 = indexCol.indexOf("207601");

          var protocol = 'OJIP'//getProtocol();

          if (protocol == 'OJIP') { slicePoints = [startOJIP, startOJIP+457]; }
          else if (protocol == 'NPQ1') { slicePoints = [startNPQ1, 159+startNPQ1]; }
          else if (protocol == 'NPQ2') { slicePoints = [startNPQ2, 249+startNPQ2]; }
          else if (protocol == 'NPQ3') { slicePoints = [startNPQ2, "282312701"]; }   // startNPQ2+164]; }
          else { alert('Protocol error!'); }

          tableData = [];
          tableData.push(indexCol);

          for(var col=0; col<array[7].length; col++) {
            if (array[7][col] == protocol) {
              var column = array.map(x => x[col]);
              // change the decimal separator from ',' to '.' (if available)
              for (var x=0; x<column.length; x++) {
                column[x] = String(column[x]).replace(",", ".");
              }
              tableData.push(column.slice(5, 983));
            }
          }

          makeTable(transpose(tableData));
}

// ===========================================




