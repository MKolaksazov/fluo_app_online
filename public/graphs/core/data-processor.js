/**
 * ==========================================
 * DATA PROCESSOR MODULE
 * Handles data extraction and transformation
 * ==========================================
 */

class DataProcessor {
  constructor(tableData, indexCol) {
    this.tableData = tableData;
    this.indexCol = indexCol;
  }

  /**
   * Gets sample label from table cell
   */
  getSampleLabel(columnIndex) {
    const cell = tbl.children[0].rows[0].childNodes[columnIndex];
    const labelElement = cell.getElementsByClassName("sampleLabel")[0];
    return labelElement ? labelElement.value : `Sample ${columnIndex}`;
  }

  /**
   * Extracts slice of data for specific column
   */
  getColumnSlice(columnIndex, slicePoints) {
    return tableData[columnIndex].slice(slicePoints[0], slicePoints[1]);
  }

  /**
   * Processes data for line chart (time series)
   */
  processTimeSeriesData(indices, slicePoints, colors) {
    const datasets = [];

    indices.forEach((index, i) => {
      const xData = this.getColumnSlice(0, slicePoints);
      const yData = this.getColumnSlice(index, slicePoints);
      
      const points = ArrayUtils.toPoints([xData, yData]);
      
      datasets.push({
        label: this.getSampleLabel(index),
        data: points,
        lineTension: 0,
        fill: false,
        borderColor: colors[i]
      });
    });
    
    return datasets;
  }

  /**
   * Extracts parameter data with repetitions for statistical analysis
   */
  extractParameterData(indices, parameter) {
    const indicesArray = Array.from(indices);
    const result = [];
    const paramIndex = tableData[0].indexOf(parameter);
    const transposed = ArrayUtils.transpose(tableData);
    let lastVariant = null;

    for (let row = 1; row < tableData.length; row++) {
      if (!indicesArray.includes(row)) continue;

      const variantName = tableData[row][0];
      if (variantName === lastVariant) continue;

      // Collect all repetitions for this variant
      const repetitions = [];
      transposed[0].forEach((label, i) => {
        if (label === variantName) {
          repetitions.push(transposed[paramIndex][i]);
        }
      });

      result.push({
        key: variantName,
        value: repetitions
      });

      lastVariant = variantName;
    }

    return result;
  }

  /**
   * Gets parameter index from column names
   */
  getParameterIndex(parameter) {
    return indexCol.indexOf(parameter);
  }

  /**
   * Extracts NPQ parameter data (Light/Dark phases)
   */
  extractNPQData(index, parameter, protocol) {
    const indexL1 = this.getParameterIndex(parameter + '_L1');
    const indexD1 = this.getParameterIndex(parameter + '_D1');
    
    const npqOffset = protocol === "NPQ2" ? 5 : 0;
    const npqOffset2 = protocol === "NPQ2" ? 4 : 0;

    return [].concat(
      this.tableData[index].slice(indexL1, indexL1 + 5 + npqOffset),
      this.tableData[index].slice(indexD1, indexD1 + 3 + npqOffset2)
    );
  }

  /**
   * Calculates Phi_Ro parameter
   */
  calculatePhiRo(index) {
    const fiIndex = this.getParameterIndex('Fi');
    const fmIndex = this.getParameterIndex('Fm');
    
    const fm = parseFloat(tbl.children[0].rows[fmIndex].childNodes[index].innerText);
    const fi = parseFloat(tbl.children[0].rows[fiIndex].childNodes[index].innerText);
    
    return (fm - fi) / fm;
  }

  /**
   * Gets standard parameter value
   */
  getParameterValue(index, parameter) {
    const paramIndex = this.getParameterIndex(parameter);
    return tbl.children[0].rows[paramIndex].childNodes[index].innerText;
  }

  /**
   * Processes parameter data based on type
   */
  processParameterData(indices, parameter, protocol) {
    const datasets = [];
    const labels = [];
    const isNPQParam = ChartConfig.parameters.npqTypes.includes(parameter);
    const isPhiRo = parameter === ChartConfig.parameters.special.PHI_RO;

    if (protocol !== 'OJIP' && isNPQParam) {
      // NPQ-type parameters
      indices.forEach((index, i) => {
        labels.push(this.getSampleLabel(index));
        const data = this.extractNPQData(index, parameter, protocol);
        
        datasets.push({
          label: labels[i],
          data: data,
          lineTension: 0,
          fill: false,
          borderColor: ChartConfig.colors[i]
        });
      });
    } else if (isPhiRo) {
      // Phi_Ro parameter
      const values = [];
      indices.forEach((index) => {
        labels.push(this.getSampleLabel(index));
        values.push(this.calculatePhiRo(index));
      });
      
      datasets.push({
        label: parameter,
        data: values,
        fill: true,
        backgroundColor: ChartConfig.colors
      });
    } else {
      // Standard parameters
      const values = [];
      indices.forEach((index) => {
        labels.push(this.getSampleLabel(index));
        values.push(this.getParameterValue(index, parameter));
      });
      
      datasets.push({
        label: parameter,
        data: values,
        backgroundColor: ChartConfig.colors
      });
    }

    return { datasets, labels };
  }

  /**
   * Gets NPQ parameter labels
   */
  getNPQLabels(parameter, protocol) {
    const indexL1 = this.getParameterIndex(parameter + '_L1');
    const indexD1 = this.getParameterIndex(parameter + '_D1');
    
    const npqOffset = protocol === "NPQ2" ? 5 : 0;
    const npqOffset2 = protocol === "NPQ2" ? 4 : 0;

    return [].concat(
      this.indexCol.slice(indexL1, indexL1 + 5 + npqOffset),
      this.indexCol.slice(indexD1, indexD1 + 3 + npqOffset2)
    );
  }
}
/*
// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataProcessor;
}
*/
