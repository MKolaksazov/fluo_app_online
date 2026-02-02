/**
 * ==========================================
 * CHART BUILDER MODULE
 * Creates different types of charts with configurations
 * ==========================================
 */

class ChartBuilder {
  constructor(canvasManager, dataProcessor, uiControls) {
    this.canvasManager = canvasManager;
    this.dataProcessor = dataProcessor;
    this.uiControls = uiControls;
  }

  /**
   * Builds scales configuration based on protocol
   */
  buildScales(protocol, gridConfig) {
    const protocolConfig = ChartConfig.protocols[protocol];
    
    if (!protocolConfig) {
      throw new Error(`Unknown protocol: ${protocol}`);
    }

    const xAxis = protocolConfig.xAxis;
    const yAxis = protocolConfig.yAxis;

    const scales = {
      x: {
        title: {
          display: true,
          text: xAxis.title
        },
        type: xAxis.type,
        grid: gridConfig
      },
      y: {
        display: true,
        title: {
          display: true,
          text: yAxis.title
        },
        ticks: {
          min: yAxis.min
        },
        grid: gridConfig
      }
    };

    // Add protocol-specific x-axis configuration
    if (protocol === 'OJIP') {
      scales.x.ticks = {
        min: xAxis.min,
        max: xAxis.max,
        maxTicksLimit: xAxis.maxTicksLimit,
        callback: (value) => xAxis.tickLabels[value] || null
      }
    } else if (protocol.match(/NPQ[1-3]/) !== null) {
      scales.x.min = xAxis.min,
      scales.x.ticks = {            
        stepSize: xAxis.stepSize,
        callback: (value) => (Math.round((value - 1) / xAxis.timeConversionFactor*10) / 10)
      }
    }

    return scales;
  }

  /**
   * Builds standard chart options
   */
  buildChartOptions(scales, displayLegend = true) {
    return {
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
  }

  /**
   * Creates a line chart for time series data
   */
  createTimeSeriesChart(indices, slicePoints, protocol) {
    const datasets = this.dataProcessor.processTimeSeriesData(
      indices, 
      slicePoints, 
      ChartConfig.colors
    );

    const gridConfig = this.uiControls.getGridConfig();
    const scales = this.buildScales(protocol, gridConfig);
    const options = this.buildChartOptions(scales, true);

    const canvas = this.canvasManager.resetCanvas();
    
    const chart = new Chart(canvas, {
      type: ChartConfig.chartTypes.line,
      data: { datasets },
      options
    });

    this.canvasManager.setChart(chart);
    return chart;
  }

  /**
   * Creates a parameter chart (bar or line)
   */
  createParameterChart(indices, parameter, protocol) {
    const result = this.dataProcessor.processParameterData(indices, parameter, protocol);
    
    let chartType = ChartConfig.chartTypes.bar;
    let chartLabels = result.labels;
    let displayLegend = false;

    // Determine chart type based on parameter and protocol
    if (protocol !== 'OJIP' && ChartConfig.parameters.npqTypes.includes(parameter)) {
      chartType = ChartConfig.chartTypes.line;
      chartLabels = this.dataProcessor.getNPQLabels(parameter, protocol);
      displayLegend = true;
    }

    const gridConfig = this.uiControls.getGridConfig();
    const scales = {
      x: {
        title: { display: true },
        grid: gridConfig
      },
      y: {
        display: true,
        title: {
          display: true,
          labelString: "[a.u.]"
        },
        ticks: { min: 0 },
        grid: gridConfig
      }
    };

    const options = this.buildChartOptions(scales, displayLegend);
    const canvas = this.canvasManager.resetCanvas();

    const chart = new Chart(canvas, {
      type: chartType,
      data: {
        labels: chartLabels,
        datasets: result.datasets
      },
      options
    });

    this.canvasManager.setChart(chart);
    return chart;
  }

  /**
   * Creates a boxplot chart with statistical annotations
   */
  createBoxplotChart(boxplotData, data, letterAssignments, tooltips) {

    const annotations = data.map((item, i) => ({
      type: 'label',
      xValue: item.key,
      yValue: Math.max(...item.value.map(Number)) * 0.9,
      content: letterAssignments[i],
      color: 'black',
      font: {
        weight: 'bold',
        size: 14
      },
      textAlign: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 1
    }));

    const canvas = this.canvasManager.resetCanvas();
    const gridConfig = this.uiControls.getGridConfig();

    const chart = new Chart(canvas, {
      type: ChartConfig.chartTypes.boxplot,
      data: boxplotData,
      options: {
        scales: {
          x: {
            title: {
              display: false,
              text: 'Experimental Variants'
            },
            grid: gridConfig,
          },
          y: {
            title: {
              display: true,
              text: 'Fluorescence [a.u.]'
            },
            grid: gridConfig,
          }
        },
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: function(context) {
                const group = context[0].label;
                return `${group} (${tooltips[group]})`;
              }
            }
          },
          annotation: {
            annotations: annotations
          }
        }
      }
    });

    this.canvasManager.setChart(chart);
    return chart;
  }
}
/*
// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChartBuilder;
}
*/
