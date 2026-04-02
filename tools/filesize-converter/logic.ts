export interface ToolResult<T> {
  output?: T;
  error?: string;
}

export interface FilesizeResult {
  binary: Record<string, string>;
  decimal: Record<string, string>;
}

const BINARY_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
const DECIMAL_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

export function getUnits() {
  return {
    binary: BINARY_UNITS,
    decimal: DECIMAL_UNITS,
  };
}

export function convertFilesize(value: number, fromUnit: string): ToolResult<FilesizeResult> {
  try {
    // Convert to bytes first
    let bytes: number;
    const bIdx = BINARY_UNITS.indexOf(fromUnit);
    const dIdx = DECIMAL_UNITS.indexOf(fromUnit);
    if (bIdx >= 0) {
      bytes = value * Math.pow(1024, bIdx);
    } else if (dIdx >= 0) {
      bytes = value * Math.pow(1000, dIdx);
    } else {
      return { error: 'Unknown unit' };
    }

    const binary: Record<string, string> = {};
    const decimal: Record<string, string> = {};
    for (let i = 0; i < BINARY_UNITS.length; i++) {
      const v = bytes / Math.pow(1024, i);
      binary[BINARY_UNITS[i]] = v < 0.01 && v !== 0 ? v.toExponential(4) : parseFloat(v.toPrecision(10)).toString();
    }
    for (let i = 0; i < DECIMAL_UNITS.length; i++) {
      const v = bytes / Math.pow(1000, i);
      decimal[DECIMAL_UNITS[i]] = v < 0.01 && v !== 0 ? v.toExponential(4) : parseFloat(v.toPrecision(10)).toString();
    }
    return { output: { binary, decimal } };
  } catch (e) {
    return { error: (e as Error).message };
  }
}
