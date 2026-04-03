export interface CrxResult {
  extensionId: string;
  chromeWebStoreUrl: string;
  crxDownloadUrl: string;
}

export function parseCrxInput(input: string): CrxResult | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Try to extract extension ID from URL or direct ID
  let extensionId = '';

  // Chrome Web Store URL pattern
  const urlMatch = trimmed.match(/chrome\.google\.com\/webstore\/detail\/[^/]*\/([a-z]{32})/i);
  if (urlMatch) {
    extensionId = urlMatch[1];
  } else if (/^[a-z]{32}$/i.test(trimmed)) {
    extensionId = trimmed.toLowerCase();
  } else {
    // Try extracting from any URL with the ID
    const idMatch = trimmed.match(/([a-z]{32})/i);
    if (idMatch) extensionId = idMatch[1].toLowerCase();
  }

  if (!extensionId) return null;

  return {
    extensionId,
    chromeWebStoreUrl: `https://chrome.google.com/webstore/detail/${extensionId}`,
    crxDownloadUrl: `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=120.0&acceptformat=crx2,crx3&x=id%3D${extensionId}%26uc`,
  };
}
