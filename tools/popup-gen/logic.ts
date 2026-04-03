// Popup Generator logic

export interface PopupOptions {
  url: string;
  width: number;
  height: number;
  toolbar: boolean;
  menubar: boolean;
  scrollbars: boolean;
  resizable: boolean;
  location: boolean;
}

export function generatePopupCode(opts: PopupOptions): string {
  const features = [
    `width=${opts.width}`,
    `height=${opts.height}`,
    `toolbar=${opts.toolbar ? 'yes' : 'no'}`,
    `menubar=${opts.menubar ? 'yes' : 'no'}`,
    `scrollbars=${opts.scrollbars ? 'yes' : 'no'}`,
    `resizable=${opts.resizable ? 'yes' : 'no'}`,
    `location=${opts.location ? 'yes' : 'no'}`,
  ].join(',');
  return `window.open('${opts.url}', '_blank', '${features}');`;
}
