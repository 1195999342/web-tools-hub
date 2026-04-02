export interface FlexConfig {
  direction: string;
  justifyContent: string;
  alignItems: string;
  flexWrap: string;
  gap: number;
}

export const DIRECTIONS = ['row', 'row-reverse', 'column', 'column-reverse'];
export const JUSTIFY = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
export const ALIGN = ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'];
export const WRAP = ['nowrap', 'wrap', 'wrap-reverse'];

export function generateCSS(config: FlexConfig): string {
  return `display: flex;
flex-direction: ${config.direction};
justify-content: ${config.justifyContent};
align-items: ${config.alignItems};
flex-wrap: ${config.flexWrap};
gap: ${config.gap}px;`;
}
