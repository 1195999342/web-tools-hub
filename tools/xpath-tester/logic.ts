// XPath Tester logic

export function evaluateXPath(xml: string, xpath: string): { results: string[]; error?: string } {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) return { results: [], error: 'Invalid XML: ' + errorNode.textContent?.slice(0, 100) };

    const result = doc.evaluate(xpath, doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const nodes: string[] = [];
    for (let i = 0; i < result.snapshotLength; i++) {
      const node = result.snapshotItem(i);
      if (!node) continue;
      if (node.nodeType === Node.ELEMENT_NODE) {
        const serializer = new XMLSerializer();
        nodes.push(serializer.serializeToString(node));
      } else {
        nodes.push(node.textContent || '');
      }
    }
    return { results: nodes };
  } catch (e) {
    return { results: [], error: (e as Error).message };
  }
}
