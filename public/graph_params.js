var colors = [

//'blue', 'orange','blue', 'orange','blue', 'orange','blue', 'orange','blue', 'orange','blue', 'orange','blue', 'orange','blue', 'orange',


'navy', 'maroon', 'teal', 'tomato', 'blue', 'orange', 'dodgerblue', 'red', 'turquoise', 'pink', 'cyan', 'tan',

'olive', 'yellow', 'green', 'grey', 'purple',
              'aqua', 'brown', 'chartreuse', 'darkblue', 'darkorange', 'darkviolet', 'darkgreen', 'lime', 'darkcyan',
              'khaki', 'navy', 'maroon', 'pink', 'teal', 'tan', 'turquoise', 'tomato', 'greenyellow',
              'blue', 'orange', 'cyan', 'red', 'olive', 'yellow', 'green', 'grey', 'purple',
              'aqua', 'brown', 'chartreuse', 'darkblue', 'darkorange', 'darkviolet', 'darkgreen', 'lime', 'darkcyan',
              'khaki', 'navy', 'maroon', 'pink', 'teal', 'tan', 'turquoise', 'tomato', 'greenyellow',
             ];

/*
var colors = ['#00f', '#f00', '#0f0', '#008', '#800', '#080', '#f0f', '#088', '#880', '#808', '#80f', '#f80', '#8f0', '#ff0', '#0ff', '#888',
              '#0f8', '#08f', '#88f', '#8f8', '#f8f',
              '#00f', '#f00', '#0f0', '#008', '#800', '#080', '#f0f', '#088', '#880', '#808', '#80f', '#f80', '#8f0', '#ff0', '#0ff', '#888',
              '#0f8', '#08f', '#88f', '#8f8', '#f8f',
              '#00f', '#f00', '#0f0', '#008', '#800', '#080', '#f0f', '#088', '#880', '#808', '#80f', '#f80', '#8f0', '#ff0', '#0ff', '#888',
              '#0f8', '#08f', '#88f', '#8f8', '#f8f',
             ];
             */

function loopDataParams(indices, parameter) {
  dataSets = []; var dataSet = {}; labels = []; var newData = []; //parameter = document.getElementById("parameter").value;

    if ((protocol != 'OJIP') && ((parameter == 'QY') || (parameter == 'Qp') || (parameter == 'NPQ') || (parameter == 'Fm'))) {
      indices.forEach((index, i) => {
        labels.push(tbl.children[0].rows[0].childNodes[index].getElementsByClassName("sampleLabel")[0].value);
        const indexL1 = indexCol.indexOf(parameter + '_L1');
        const indexD1 = indexCol.indexOf(parameter + '_D1');
        const extParams = [].concat(tableData[index].slice(indexL1, indexL1 + 5 + (protocol.value=="NPQ2" ? 5 : 0 )), 
        tableData[index].slice(indexD1, indexD1 + 3 + (protocol.value=="NPQ2" ? 4 : 0 )));
        
        dataSet = {
          label: labels[i],
          data: extParams,
          lineTension: 0,
          fill: false,
          borderColor: colors[i],// "hsl("+ colors[i] +", 100%, 50%)",
        };dataSets.push(dataSet);
      });
    }

    else if (parameter == 'Phi_Ro') {
      const fiI = indexCol.indexOf('Fi'); const fmI = indexCol.indexOf('Fm'); // const fmI = fiI+1;
        indices.forEach((index, i) => {
          var fm = parseFloat(tbl.children[0].rows[fmI].childNodes[index].innerText);
          var fi = parseFloat(tbl.children[0].rows[fiI].childNodes[index].innerText);
          var PhiRo = (fm - fi) / fm;

          newData.push(PhiRo);
          labels.push(tbl.children[0].rows[0].childNodes[index].getElementsByClassName("sampleLabel")[0].value);

          dataSet = {
            label: parameter, // none
            data: newData,
            fill: true,
            backgroundColor: colors,
          };
      }); dataSets.push(dataSet);
    }

    else {
      indices.forEach((index, i) => {
        const indexParam = indexCol.indexOf(parameter);
        newData.push(tbl.children[0].rows[indexParam].childNodes[index].innerText);
        labels.push(tbl.children[0].rows[0].childNodes[index].getElementsByClassName("sampleLabel")[0].value);

          dataSet = {
            label: parameter, // none
            data: newData,
            backgroundColor: colors,
          };
      }); dataSets.push(dataSet);
    }
}


/*
function closeButton() {
  var closeButton = document.createElement("button");
  closeButton.setAttribute("id", "closeButton");
  closeButton.setAttribute("onclick", `close()`);
  closeButton.innerText = "X";
  closeButton.setAttribute("style", "width: 21px; height: 21px; background: red; color: white; position: absolute; top: 0px; right: 0px;");
  document.getElementById("canvasContainer").appendChild(closeButton);
}
*/
function closeButton() {
  // Create the close button element
  const closeButton = document.createElement("button");
  closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16"> <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/> <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/></svg>`;
// "X";
  closeButton.classList.add("close-button"); // Add a class for styling
  closeButton.style.cssText = "position: absolute; top: 0; right: 0; background: transparent; color: white; border: none; padding: 5px; cursor: pointer;";

  // Attach the close button to the canvas container
  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.appendChild(closeButton);

  // Add a click event listener to the close button
  closeButton.addEventListener("click", () => {
    clearCanvasContainer();
  });
}

function gridButton(draw, protocol) {
  const gridButton = document.createElement("button");

  gridButton.innerHTML = `grid on/off`;
  gridButton.id = "grid-button"; // Add a class for styling
  gridButton.classList.add('btn-right');
  gridButton.classList.add('aqua');
  gridButton.style.cssText = "position: relative; display: float; background: transparent; color: white; border: none; padding: 5px; cursor: pointer;";

  // Attach the close button to the canvas container
  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.appendChild(gridButton);

  // Add a click event listener to the close button
  gridButton.addEventListener("click", () => {
    if (grid) { grid = false; } else { grid = true; }
    document.getElementById('grid-button').remove();
    document.getElementById('font-button').remove();
    if (draw == 'graph') { drawGraph(protocol); }
    if (draw == 'parameters') { drawParameters(protocol); }
    if (draw == '') {}
  });
}

function fontButton(draw, protocol) {
  // Create the close button element
  const fontButton = document.createElement("input");
  fontButton.innerHTML = `change font`;
  fontButton.type = 'range';
  fontButton.min = '8';
  fontButton.max = '32';
  fontButton.value = Chart.defaults.font.size;
  fontButton.id = "font-button"; // Add a class for styling
  fontButton.classList.add('aqua');
  fontButton.classList.add('btn-right');
  fontButton.style.cssText = "position: relative; display: float; background: transparent; color: white; border: none; padding: 5px; cursor: pointer;";

  // Attach the close button to the canvas container
  const canvasContainer = document.getElementById("canvasContainer");
  canvasContainer.appendChild(fontButton);

  // Add a click event listener to the close button
  fontButton.addEventListener("click", () => {
    document.getElementById('grid-button').remove();
    document.getElementById('font-button').remove();
    Chart.defaults.font.size = fontButton.value;
    if (draw == 'graph') { drawGraph(protocol); }
    if (draw == 'parameters') { drawParameters(protocol); }
    if (draw == '') {}
  });
}

function clearCanvasContainer() {
  // Remove all child elements from the canvas container
  const canvasContainer = document.getElementById("canvasContainer");
  while (canvasContainer.firstChild) {
    canvasContainer.removeChild(canvasContainer.firstChild);
  }
}




//document.getElementById('drawParams').onclick(parameter = document.getElementById('drawParams').innerHTML);
function drawParameters(protocol) {
  if (colsSelected.size === 0) { alert('Error! Column(s) not selected!'); return; }  // else {  }
 
  gridButton('parameters', protocol);
  fontButton('parameters', protocol);
  closeButton();

  var blackGrid = drawGrid();
  var speedCanvas = removeFlicker();
  var options = document.getElementById("parameters");
  var parameter = options[options.selectedIndex].text;
  var displayLegend = false;

  loopDataParams(colsSelected, parameter);

  if (protocol == 'OJIP') { // spider diagram : OJIP; line graphs : NPQ
    var type = 'bar';
    var speedData = {
      labels: labels, //labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"], NONE!
      datasets: dataSets
    };

    displayLegend = false;
  }
  else { // spider diagram : OJIP; line graphs : NPQ

    if ((parameter == 'QY') || (parameter == 'Qp') || (parameter == 'NPQ') || (parameter == 'Fm')) {
      var type = 'line';
      var indexL1 = indexCol.indexOf(parameter + '_L1');
      var indexD1 = indexCol.indexOf(parameter + '_D1');
      var labelsNPQ = [].concat(indexCol.slice(indexL1, indexL1 + 5 + (protocol=="NPQ2" ? 5 : 0 )), indexCol.slice(indexD1, indexD1 + 3 + (protocol=="NPQ2" ? 4 : 0 )));

      var speedData = {
        labels: labelsNPQ, // ["0s", "10s", "20s", "30s", "40s", "50s", "60s", "70s", "80s", "80s", "100s"], //
        datasets: dataSets
      };

      displayLegend = true;
    }
    if (parameter == 'Rfd') {
      var type = 'bar';
      var speedData = {
        labels: labels, //labels: ["0s", "10s", "20s", "30s", "40s", "50s", "60s"], NONE!
        datasets: dataSets
      };

      displayLegend = false;
    }
    //else { alert('Parameter error!'); }
  }

    var scales =  {
      x: {
          title: {
              display: true,
          },
          grid: blackGrid,
      },

      y: {
          display: true,
          title: {
              display: true,
              labelString: "[a.u.]"
          },
          ticks: {
              min: 0,
          },
          grid: blackGrid,
      }
    };

    var chartOptions = {

      legend: {
        display: displayLegend,
        position: 'right',
        labels: {
          boxWidth: 40,
          fontColor: 'black'
        }
      },

      scales: scales
    };

    var lineChart = new Chart(speedCanvas, {
      type: type,
      data: speedData,
      options: chartOptions
    });

}

