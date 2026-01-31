/**
 * ==========================================
 * CHART SYSTEM - MAIN ENTRY POINT
 * Loads all modules and provides unified API
 * ==========================================
 * 
 * USAGE:
 * ------
 * // Initialize the application
 * const chartApp = initChartApp(tableData, indexCol, slicePoints);
 * 
 * // Or use backwards-compatible global functions:
 * drawGraph('OJIP');           // Draw time series
 * drawParameters('NPQ');        // Draw parameters
 * drawBoxplot();               // Draw boxplot with statistics
 * 
 * ARCHITECTURE:
 * ------------
 * config/
 *   └── chart-config.js        - All constants and configuration
 * 
 * utils/
 *   └── common-utils.js        - Array, Math, String utilities
 * 
 * core/
 *   ├── canvas-manager.js      - Canvas lifecycle management
 *   ├── data-processor.js      - Data extraction and transformation
 *   ├── chart-builder.js       - Chart creation and configuration
 *   └── chart-application.js   - Main application controller
 * 
 * modules/
 *   └── statistical-analyzer.js - Statistical tests and analysis
 * 
 * ui/
 *   └── ui-controls.js         - Interactive UI elements
 */

// Load order is important due to dependencies
const LOAD_ORDER = [
  'config/chart-config.js',
  'utils/common-utils.js',
  'core/canvas-manager.js',
  'ui/ui-controls.js',
  'core/data-processor.js',
  'modules/statistical-analyzer.js',
  'core/chart-builder.js',
  'core/chart-application.js'
];

/**
 * Script loader utility
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Load all modules in sequence
 */
async function loadChartSystem(basePath = './graphs/') {
  try {
    for (const file of LOAD_ORDER) {
      await loadScript(basePath + file);
    }
    console.log('✅ Chart System loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to load Chart System:', error);
    return false;
  }
}

// Auto-load if in browser
if (typeof window !== 'undefined') {
  // Expose loading function globally
  //window.loadChartSystem = loadChartSystem;
  
  // Optional: Auto-load on page ready
  document.addEventListener('DOMContentLoaded', () => loadChartSystem());
}

/**
 * ==========================================
 * QUICK START GUIDE
 * ==========================================
 * 
 * 1. Include this file in your HTML:
 *    <script src="chart-system/index.js"></script>
 * 
 * 2. Load the system:
 *    await loadChartSystem();
 * 
 * 3. Initialize with your data:
 *    const app = initChartApp(tableData, indexCol, slicePoints);
 * 
 * 4. Draw charts:
 *    app.drawTimeSeriesGraph(colsSelected, 'OJIP');
 *    app.drawParameterChart(colsSelected, 'QY', 'NPQ');
 *    app.drawBoxplot(colsSelected, 'Fm');
 * 
 * OR use backwards-compatible functions:
 *    drawGraph('OJIP');
 *    drawParameters('NPQ');
 *    drawBoxplot();
 */




