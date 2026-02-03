/**
 * ==========================================
 * CHART APPLICATION - MAIN MODULE
 * Central controller for all chart operations
 * ==========================================
 */

class ChartApplication {
  constructor(tableData, indexCol, slicePoints) {
    // Core components
    this.canvasManager = new CanvasManager();
    this.dataProcessor = new DataProcessor(tableData, indexCol);
    this.uiControls = new UIControls(this.canvasManager);
    this.chartBuilder = new ChartBuilder(
      this.canvasManager, 
      this.dataProcessor, 
      this.uiControls
    );
    this.statisticalAnalyzer = new StatisticalAnalyzer();

    // Data references
    this.tableData = tableData;
    this.indexCol = indexCol;
    this.slicePoints = slicePoints;

    // Initialize
    initializeChartDefaults();
  }

  /**
   * Validates column selection
   */
  validateSelection(colsSelected) {
    if (!colsSelected || colsSelected.size === 0) {
      alert('Error! Column(s) not selected!');
      return false;
    }
    return true;
  }

  /**
   * Draws time series graph (OJIP or NPQ)
   */
  drawTimeSeriesGraph(colsSelected, protocol) {
    if (!this.validateSelection(colsSelected)) return;

    // Setup UI controls with redraw callback
    this.uiControls.setupStandardControls(() => {
      this.drawTimeSeriesGraph(colsSelected, protocol);
    });
    
    localStorage.setItem('draw', 'drawGraph');

    // Create chart
    this.chartBuilder.createTimeSeriesChart(
      Array.from(colsSelected),
      slicePoints,
      protocol
    );
  }

  /**
   * Draws parameter chart
   */
  drawParameterChart(colsSelected, parameter, protocol) {
    if (!this.validateSelection(colsSelected)) return;

    // Setup UI controls with redraw callback
    this.uiControls.setupStandardControls(() => {
      this.drawParameterChart(colsSelected, parameter, protocol);
    });

    localStorage.setItem('draw', 'drawParameters');

    // Create chart
    this.chartBuilder.createParameterChart(
      Array.from(colsSelected),
      parameter,
      protocol
    );
  }

  /**
   * Draws boxplot with statistical analysis
   */
  drawBoxplot(colsSelected, parameter) {
    if (!this.validateSelection(colsSelected)) return;

    try {
      // Extract data
      const data = this.dataProcessor.extractParameterData(colsSelected, parameter);

      // Calculate statistics
      const boxplotData = this.statisticalAnalyzer.calculateBoxplotStats(data);

      // Prepare for Tukey HSD
      const tukeyInput = data.map(item => ({
        group: item.key,
        repetitions: item.value.map(Number)
      }));

      // Perform statistical analysis
      const tukeyResults = this.statisticalAnalyzer.performTukeyHSD(tukeyInput);
      const letterAssignments = this.statisticalAnalyzer.assignSignificanceLetters(tukeyResults);

      // Prepare tooltips
      const tooltips = {};
      letterAssignments.forEach((letter, i) => {
        tooltips[data[i].key] = letter;
      });

      // Setup UI controls with redraw callback
      this.uiControls.setupStandardControls(() => {
        this.drawBoxplot(colsSelected, parameter, protocol);
      });

      localStorage.setItem('draw', 'drawBoxplot');

      // Create chart
      this.chartBuilder.createBoxplotChart(boxplotData, data, letterAssignments, tooltips);

    } catch (error) {
      alert('Error! Select at least two repetitions of each variant!');
      console.error(error);
    }
  }

  /**
   * Gets current parameter from select element
   */
  getSelectedParameter() {
    const selectElement = document.getElementById("parameters");
    if (!selectElement) return null;
    
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    return selectedOption ? selectedOption.text : null;
  }

  /**
   * Clears all charts and UI
   */
  clear() {
    this.canvasManager.clearContainer();
  }
}

// ==========================================
// GLOBAL API - Backwards Compatibility
// ==========================================

// Global instance (will be initialized when needed)
let chartApp = null;
const app = initChartApp(tableData, indexCol, slicePoints);

/**
 * Initialize the chart application
 */
function initChartApp(tableData, indexCol, slicePoints) {
  chartApp = new ChartApplication(tableData, indexCol, slicePoints);
  return chartApp;
}

/**
 * Draw main graph (backwards compatible)
 */
function drawGraph(protocol) {
  if (!chartApp) {
    console.error('Chart application not initialized');
    return;
  }
  chartApp.drawTimeSeriesGraph(colsSelected, protocol);
}

/**
 * Draw parameters (backwards compatible)
 */
function drawParameters(protocol) {
  if (!chartApp) {
    console.error('Chart application not initialized');
    return;
  }
  const parameter = chartApp.getSelectedParameter();
  if (parameter) {
    chartApp.drawParameterChart(colsSelected, parameter, protocol);
  }
}

/**
 * Draw boxplot (backwards compatible)
 */
function drawBoxplot() {
  if (!chartApp) {
    console.error('Chart application not initialized');
    return;
  }
  const parameter = chartApp.getSelectedParameter();
  if (parameter) {
    chartApp.drawBoxplot(colsSelected, parameter);
  }
}

// Attach the function to the button
document.getElementById('drawBoxPlot').setAttribute('onclick', `drawBoxplot();`);
/*
// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ChartApplication,
    initChartApp,
    drawGraph,
    drawParameters,
    drawBoxplot
  };
}
*/
