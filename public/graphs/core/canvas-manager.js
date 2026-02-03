/**
 * ==========================================
 * CANVAS MANAGER MODULE
 * Handles canvas creation, cleanup and state
 * ==========================================
 */

class CanvasManager {
  constructor(containerId = 'canvasContainer') {
    this.containerId = containerId;
    this.canvasId = 'myChart';
    this.currentChart = null;
  }

  /**
   * Gets the canvas container element
   */
  getContainer() {
    return document.getElementById(this.containerId);
  }

  /**
   * Gets existing canvas or null
   */
  getCanvas() {
    return document.getElementById(this.canvasId);
  }

  /**
   * Removes existing canvas to prevent flickering
   */
  removeCanvas() {
    const existing = this.getCanvas();
    if (existing) {
      existing.remove();
    }
  }

  /**
   * Creates a fresh canvas element
   */
  createCanvas() {
    this.removeCanvas();
    
    const container = this.getContainer();
    const canvas = document.createElement('canvas');
    
    canvas.setAttribute('id', this.canvasId);
    canvas.style.width = 'max-content';
    canvas.style.height = 'max-content';
    
    container.appendChild(canvas);
    return canvas;
  }

  /**
   * Resets canvas (removes and creates new)
   */
  resetCanvas() {
    return this.createCanvas();
  }

  /**
   * Clears entire container
   */
  clearContainer() {
    const container = this.getContainer();
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    this.currentChart = null;
    localStorage.removeItem('draw');
  }

  /**
   * Destroys current chart instance
   */
  destroyChart() {
    if (this.currentChart) {
      this.currentChart.destroy();
      this.currentChart = null;
    }
  }

  /**
   * Sets the current chart instance
   */
  setChart(chart) {
    this.destroyChart();
    this.currentChart = chart;
  }

  /**
   * Gets canvas 2D context
   */
  getContext() {
    const canvas = this.getCanvas();
    return canvas ? canvas.getContext('2d') : null;
  }
}
/*
// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CanvasManager;
}
*/
