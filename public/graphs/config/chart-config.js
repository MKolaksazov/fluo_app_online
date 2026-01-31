/**
 * ==========================================
 * CHART CONFIGURATION MODULE
 * Central configuration for all chart types
 * ==========================================
 */

const ChartConfig = {
  // Visual defaults
  defaults: {
    fontFamily: "Lato, sans-serif",
    color: '#808080',
    fontSize: 16,
    borderColor: '#808080',
    gridColor: '#808080',
    gridLineWidth: 1
  },

  // Color palette for charts
  colors: [
    'navy', 'maroon', 'teal', 'tomato', 'blue', 'orange', 'dodgerblue', 'red',
    'turquoise', 'pink', 'cyan', 'tan', 'olive', 'yellow', 'green', 'grey', 'purple',
    'aqua', 'brown', 'chartreuse', 'darkblue', 'darkorange', 'darkviolet', 'darkgreen',
    'lime', 'darkcyan', 'khaki', 'navy', 'maroon', 'pink', 'teal', 'tan', 'turquoise',
    'tomato', 'greenyellow', 'blue', 'orange', 'cyan', 'red', 'olive', 'yellow',
    'green', 'grey', 'purple', 'aqua', 'brown', 'chartreuse', 'darkblue', 'darkorange',
    'darkviolet', 'darkgreen', 'lime', 'darkcyan', 'khaki', 'navy', 'maroon', 'pink',
    'teal', 'tan', 'turquoise', 'tomato', 'greenyellow'
  ],

  // Protocol-specific settings
  protocols: {
    OJIP: {
      xAxis: {
        title: 'time [ms] (log base 10)',
        type: 'logarithmic',
        min: 20,
        max: 2000000,
        maxTicksLimit: 20,
        tickLabels: {
          1000000: "1000",
          100000: "100",
          10000: "10",
          1000: "1",
          100: "0.1"
        }
      },
      yAxis: {
        title: "[a.u.]",
        min: 0
      }
    },
    NPQ: {
      xAxis: {
        title: 'time [min]',
        type: 'linear',
        min: 207601,
        timeConversionFactor: 60000000
      },
      yAxis: {
        title: "[a.u.]",
        min: 0
      }
    }
  },

  // Parameter types
  parameters: {
    npqTypes: ['QY', 'Qp', 'NPQ', 'Fm'],
    special: {
      PHI_RO: 'Phi_Ro',
      RFD: 'Rfd'
    }
  },

  // Chart type mappings
  chartTypes: {
    line: 'line',
    bar: 'bar',
    boxplot: 'boxplot'
  },

  // Statistical settings
  statistics: {
    alphaLevel: 0.05,
    quantiles: [0.25, 0.5, 0.75]
  }
};

// Initialize Chart.js with defaults
function initializeChartDefaults() {
  if (typeof Chart !== 'undefined') {
    Chart.defaults.defaultFontFamily = ChartConfig.defaults.fontFamily;
    Chart.defaults.color = ChartConfig.defaults.color;
    Chart.defaults.font.size = ChartConfig.defaults.fontSize;
    Chart.defaults.scale.border.color = ChartConfig.defaults.borderColor;
  }
}
/*
// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChartConfig;
}
*/
