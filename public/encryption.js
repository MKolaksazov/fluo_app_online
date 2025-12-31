// https://github.com
// const targetUrl = 'https://mkolaksazov.github.io/Telerik-Academy/JavaScript/csv_tool/key.md';
//const targetUrl = 'https://mkolaksazov.github.io/Telerik-Academy/JavaScript/csv_tool/README.md';
//var href = document.querySelector("#href");
//href.setAttribute('href', targetUrl);
// Place the 'generateSecretKey' function in your project
//import CryptoJS, { AES } from 'crypto-js';
/*
const keyLength = 32; // 32 bytes = 256 bits (AES-256)
const buffer = new Uint8Array(keyLength);
self.crypto.getRandomValues(buffer);

function generateSecretKey() {
    return Array.from(buffer, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
const secretKey = generateSecretKey();
async function getSampleText() {
  return (await fetch(targetUrl).then(x=>x.text()));
}
console.log(secretKey);
*/

//const { generateKeyPairSync } = require('crypto');

//function _0x5d2a(){const _0x2fed86=['1584140TpZHhw','30744kfZlUZ','1558851OJxPGP','288GevFzX','107310VAZOKJ','2751dcb7863d345278a19fd66388cdf1ba94334959a6aed37763a7040a18a010','2998718nHtKQo','355jofPbN','1145928PBiwaM','131757WzlVaL'];_0x5d2a=function(){return _0x2fed86;};return _0x5d2a();}const _0x3669d0=_0x501f;(function(_0x485ccb,_0xa6f7c6){const _0x52d019=_0x501f,_0x2921fa=_0x485ccb();while(!![]){try{const _0x5540fc=parseInt(_0x52d019(0x1e5))/0x1+-parseInt(_0x52d019(0x1e3))/0x2+-parseInt(_0x52d019(0x1e6))/0x3+-parseInt(_0x52d019(0x1dd))/0x4+-parseInt(_0x52d019(0x1e4))/0x5*(-parseInt(_0x52d019(0x1e1))/0x6)+parseInt(_0x52d019(0x1df))/0x7+-parseInt(_0x52d019(0x1e0))/0x8*(-parseInt(_0x52d019(0x1de))/0x9);if(_0x5540fc===_0xa6f7c6)break;else _0x2921fa['push'](_0x2921fa['shift']());}catch(_0x2b5526){_0x2921fa['push'](_0x2921fa['shift']());}}}(_0x5d2a,0xc8b67));function _0x501f(_0x440753,_0x116b74){const _0x5d2af3=_0x5d2a();return _0x501f=function(_0x501f03,_0x5cf940){_0x501f03=_0x501f03-0x1dd;let _0x1ec98a=_0x5d2af3[_0x501f03];return _0x1ec98a;},_0x501f(_0x440753,_0x116b74);}const secretKey=_0x3669d0(0x1e2);
// ===========================================

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

function downloadBlob(content=tableData, filename=`export.csv`, contentType='text/csv;charset=utf-8;') {
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
*
*/



