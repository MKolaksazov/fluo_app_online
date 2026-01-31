/**
 * ==========================================
 * STATISTICAL ANALYSIS MODULE
 * Handles statistical calculations and tests
 * ==========================================
 */

class StatisticalAnalyzer {
  constructor() {
    this.alphaLevel = ChartConfig.statistics.alphaLevel;
    this.quantiles = ChartConfig.statistics.quantiles;
  }

  /**
   * Calculates boxplot statistics for data
   */
  calculateBoxplotStats(data) {
    const bpData = [];
    const labels = [];
    const backgroundColors = [];
    const colorCount = parseInt(document.getElementById("colorsInput")?.value || 1);

    data.forEach((item, i) => {
      const values = item.value.map(Number);
      const groupStats = jStat(values);
      const quantiles = groupStats.quantiles(this.quantiles);

      bpData.push({
        min: MathUtils.min(values),
        q1: quantiles[0],
        median: quantiles[1],
        q3: quantiles[2],
        max: MathUtils.max(values)
      });

      labels.push(item.key);

      // Add colors for this group
      for (let j = 0; j < colorCount; j++) {
        backgroundColors.push(ChartConfig.colors[i]);
      }
    });

    return {
      labels,
      datasets: [{
        data: bpData,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(0,123,255,1)',
        borderWidth: 1
      }]
    };
  }

  /**
   * Performs Tukey HSD test
   */
  performTukeyHSD(groupStats) {
    const groups = groupStats.map(x => x.group);
    const repetitionsArray = groupStats.map(x => x.repetitions);
    const tukeyResults = jStat.tukeyhsd(repetitionsArray);
    const comparisons = [];

    let count = 0;
    for (let i = 0; i < groups.length; i++) {
      for (let j = i + 1; j < groups.length; j++) {
        comparisons.push({
          group1: groups[i],
          group2: groups[j],
          significant: tukeyResults[count][1] < this.alphaLevel
        });
        count++;
      }
    }

    return comparisons;
  }

  /**
   * Assigns statistical significance letters to groups
   */
  assignSignificanceLetters(comparisons) {
    if (comparisons.length === 0) return [];

    const groups = Array.from(
      new Set(comparisons.flatMap(({ group1, group2 }) => [group1, group2]))
    );

    const groupCount = groups.length;
    let matrix = ArrayUtils.create2D(groupCount, groupCount);
    
    // Initialize first column with 1s
    matrix.forEach(row => row[0] = 1);

    let comparisonIndex = 0;

    // Process comparisons
    for (let i = 0; i < groupCount; i++) {
      for (let j = i + 1; j < groupCount; j++) {
        if (comparisons[comparisonIndex].significant) {
          matrix = this._separateGroups(matrix, i, j);
        }
        comparisonIndex++;
      }
    }

    return this._convertMatrixToLetters(matrix);
  }

  /**
   * Separates two groups in the matrix
   * @private
   */
  _separateGroups(matrix, groupI, groupJ) {
    for (let col = 0; col < matrix[0].length; col++) {
      if (matrix[groupI][col] === 1 && matrix[groupJ][col] === 1) {
        let newMatrix = this._duplicateColumn(matrix, col);
        newMatrix[groupI][col] = 0;
        newMatrix[groupJ][col + 1] = 0;
        
        newMatrix = this._optimizeMatrix(newMatrix);
        return newMatrix;
      }
    }
    return matrix;
  }

  /**
   * Duplicates a column in the matrix
   * @private
   */
  _duplicateColumn(matrix, colIndex) {
    const shifted = this._shiftColumns(matrix, colIndex + 1, 'forward');
    shifted.forEach(row => {
      row[colIndex + 1] = row[colIndex];
    });
    return shifted;
  }

  /**
   * Shifts columns in matrix
   * @private
   */
  _shiftColumns(matrix, fromIndex, direction) {
    return matrix.map(row => {
      const firstPart = row.slice(0, fromIndex);
      const secondPart = row.slice(fromIndex);
      
      const shiftedPart = direction === 'forward'
        ? ArrayUtils.shiftForward(secondPart)
        : ArrayUtils.shiftBackward(secondPart);
      
      return firstPart.concat(shiftedPart);
    });
  }

  /**
   * Optimizes matrix by removing redundant columns
   * @private
   */
  _optimizeMatrix(matrix) {
    let optimized = matrix;
    
    for (let leftCol = 0; leftCol < optimized.length - 1; leftCol++) {
      for (let rightCol = leftCol + 1; rightCol < optimized.length; rightCol++) {
        
        if (!this._columnHasValues(optimized, leftCol) || 
            !this._columnHasValues(optimized, rightCol)) {
          continue;
        }

        if (this._columnDominates(optimized, leftCol, rightCol, '>=')) {
          this._clearColumn(optimized, rightCol);
          optimized = this._shiftColumns(optimized, rightCol, 'backward');
        } else if (this._columnDominates(optimized, leftCol, rightCol, '<=')) {
          this._clearColumn(optimized, leftCol);
          optimized = this._shiftColumns(optimized, leftCol, 'backward');
        }
      }
    }
    
    return optimized;
  }

  /**
   * Checks if column has values
   * @private
   */
  _columnHasValues(matrix, colIndex) {
    return matrix.some(row => !isNaN(row[colIndex]));
  }

  /**
   * Checks if one column dominates another
   * @private
   */
  _columnDominates(matrix, col1, col2, operator) {
    if (operator === '>=') {
      return matrix.every(row => row[col1] >= row[col2]);
    } else if (operator === '<=') {
      return matrix.every(row => row[col1] <= row[col2]);
    }
    return false;
  }

  /**
   * Clears column by setting all values to 0
   * @private
   */
  _clearColumn(matrix, colIndex) {
    matrix.forEach(row => row[colIndex] = 0);
  }

  /**
   * Converts matrix to letter assignments
   * @private
   */
  _convertMatrixToLetters(matrix) {
    const reversed = matrix.map(row => [...row].reverse());
    const letterMatrix = reversed.map(row => 
      row.filter(value => typeof value === 'number')
    );

    // Assign letters
    for (let col = 0; col < letterMatrix[0].length; col++) {
      for (let row = 0; row < letterMatrix.length; row++) {
        if (letterMatrix[row][col] === 1) {
          letterMatrix[row][col] = StringUtils.letterFromIndex(col);
        } else {
          letterMatrix[row][col] = '';
        }
      }
    }

    return letterMatrix.map(row => row.join(''));
  }
}
/*
// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StatisticalAnalyzer;
}
*/
