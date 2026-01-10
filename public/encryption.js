function transpose(arrayData) {
  return arrayData[0].map((_, colIndex) => arrayData.map(row => row[colIndex]));
}

/** Convert a 2D array into a CSV string
 */
function arrayToCsv(data){
  return data.map(row =>
    row
    .map(String)  // convert every value to String
    .map(v => v.replaceAll('"', '""'))  // escape double quotes
    .map(v => `${v}`)  // quote it
    .join('\t')  // tab (comma)-separated
  ).join('\t\n');  // rows starting on new lines
}

/** Download contents as a file
 * Source: https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
 */

async function downloadBlob(content=tableData, filename=`export.csv`, contentType='text/csv;charset=utf-8;') {
  const token = localStorage.getItem('token');
  
  // 1. Попитай backend дали имаш право (НЕ проверявай localStorage!)
  const authCheck = await fetch('/api/data/check-download-permission', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!authCheck.ok) {  // ← Backend казва НЕ
    alert('Unauthorized action! Please upgrade to superuser.');
    return;
  }

  var fname = document.getElementById('export').value;
  filename=`${fname}.csv`;
  
  if (colsSelected.size > 0) { content = insertSelected(colsSelected); }
  else { alert('Error! Column(s) not selected!'); return; } 
  
  content = transpose(content);

  var times = 5; while(times--) {
    content.unshift([ " " ]);
  }

  var csv = arrayToCsv(content);

  // var pass = document.getElementById('pwd').value;
  // if (pass != secretKey) { alert("CSV files can't be downloaded without the password!"); return; }
  // Create a blob
  var blob = new Blob([csv], { type: contentType });
  var url = URL.createObjectURL(blob);

  // Create a link to download it
  var pom = document.createElement('a');
  pom.href = url;
  pom.setAttribute('download', filename);
  pom.click();
}

function insertSelected(indices) {
  dataSets = [tableData[0]];

  indices.forEach((index, i) => {
    dataSets.push(tableData[index]);
  }); //console.log(dataSets);
  return dataSets;
}


/*
*
*

  var encrypted = CryptoJS.AES.encrypt(csv, secretKey);
  csv = "encrypted: " + encrypted; 

  ** Code, used for decrypting of the CSV file:

  var csv = arrayToCsv(content);
  var encrypted = CryptoJS.AES.encrypt(csv, key);
  //equivalent to CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(message), key);
  var decrypted = CryptoJS.AES.decrypt(encrypted, key);
  csv = "enc: " + encrypted; // + "dec: " + decrypted.toString(CryptoJS.enc.Utf8);

*
*
*/



