/**
 * ==========================================
 * UI CONTROLS MODULE
 * Manages interactive UI elements (buttons, sliders)
 * ==========================================
 */

class UIControls {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
    this.gridEnabled = false;
  }

  /**
   * Creates close button with SVG icon
   */
  createCloseButton(onClose) {
    const button = document.createElement("button");
    
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" 
           class="bi bi-x-square" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
      </svg>
    `;
    
    this.applyButtonStyles(button, {
      position: 'absolute',
      top: '0',
      right: '0',
      margin: '8px 0px',
      background: 'transparent',
      color: '#808080'
    });

    button.addEventListener("click", onClose || (() => this.canvasManager.clearContainer()));
    
    return button;
  }

  /**
   * Creates grid toggle button
   */
  createGridButton(onToggle) {
    const button = document.createElement("button");
    
    button.id = "grid-button";
    button.innerHTML = 'grid on/off';
    button.classList.add('btn-right', 'aqua');
    
    this.applyButtonStyles(button, {
      position: 'relative',
      display: 'float',
      background: 'transparent',
      color: 'white'
    });

    button.addEventListener("click", () => {
      this.gridEnabled = !this.gridEnabled;
      if (onToggle) onToggle(this.gridEnabled);
    });
    
    return button;
  }

  /**
   * Creates font size slider
   */
  createFontSlider(onChange, currentSize = 16) {
    const slider = document.createElement("input");

    slider.type = 'range';
    slider.id = "font-button";
    slider.min = '8';
    slider.max = '32';
    slider.value = currentSize;
    slider.classList.add('aqua', 'btn-right');
    
    this.applyButtonStyles(slider, {
      position: 'relative',
      display: 'float',
      background: 'transparent',
      color: 'white'
    });

    slider.addEventListener("input", () => {
      if (onChange) onChange(parseInt(slider.value));
    });
    
    return slider;
  }

  /**
   * Applies common button styles
   */
  applyButtonStyles(element, additionalStyles = {}) {
    const baseStyles = {
      border: 'none',
      padding: '0px',
      cursor: 'pointer',
      margin: '0px 50px 0px 50px',
    };
    
    const styles = { ...baseStyles, ...additionalStyles };
    element.style.cssText = Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  }

  /**
   * Removes specific controls by ID
   */
  removeControl(id) {
    const element = document.getElementById(id);
    if (element) element.remove();
  }

  /**
   * Removes all controls
   */
  removeAllControls() {
    this.removeControl('grid-button');
    this.removeControl('font-label');
    this.removeControl('font-button');
    this.removeControl('close-button');
  }

  /**
   * Attaches control to container
   */
  attachToContainer(control) {
    const container = this.canvasManager.getContainer();
    if (container) {
      container.appendChild(control);
    }
  }

  /**
   * Creates and attaches all standard controls
   */
  setupStandardControls(redrawCallback) {
    this.removeAllControls();

    // Close button
    const closeBtn = this.createCloseButton();
    this.attachToContainer(closeBtn);

    // Grid button
    const gridBtn = this.createGridButton(() => {
      this.removeAllControls();
      redrawCallback();
    });
    this.attachToContainer(gridBtn);

    // Label for the font slider
    const fontLabel = document.createElement("label");
    fontLabel.innerHTML = `font size`;
    fontLabel.id = "font-label";
    this.applyButtonStyles(fontLabel);
    this.attachToContainer(fontLabel);

    // Font slider
    const fontSlider = this.createFontSlider((size) => {
      this.removeAllControls();
      if (typeof Chart !== 'undefined') {
        Chart.defaults.font.size = size;
      }
      redrawCallback();
    }, Chart?.defaults?.font?.size || 16);
    this.attachToContainer(fontSlider);
  }

  /**
   * Gets current grid configuration
   */
  getGridConfig() {
    if (this.gridEnabled) {
      return {
        color: ChartConfig.defaults.gridColor,
        lineWidth: ChartConfig.defaults.gridLineWidth,
        drawBorder: true
      };
    }
    return {
      color: '',
      lineWidth: 0
    };
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIControls;
}
