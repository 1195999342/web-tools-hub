// JSON to Postman Collection logic

export function jsonToPostmanCollection(json: string, collectionName: string): string {
  try {
    const data = JSON.parse(json);
    const items: any[] = [];

    if (Array.isArray(data)) {
      data.forEach((item, i) => {
        items.push({
          name: `Request ${i + 1}`,
          request: {
            method: item.method || 'GET',
            header: Object.entries(item.headers || {}).map(([k, v]) => ({ key: k, value: v })),
            url: { raw: item.url || '', protocol: '', host: [], path: [] },
            body: item.body ? { mode: 'raw', raw: typeof item.body === 'string' ? item.body : JSON.stringify(item.body) } : undefined,
          },
        });
      });
    } else {
      // Treat as a single request definition
      items.push({
        name: collectionName,
        request: {
          method: data.method || 'GET',
          header: Object.entries(data.headers || {}).map(([k, v]) => ({ key: k, value: v })),
          url: { raw: data.url || '' },
          body: data.body ? { mode: 'raw', raw: typeof data.body === 'string' ? data.body : JSON.stringify(data.body) } : undefined,
        },
      });
    }

    const collection = {
      info: {
        name: collectionName,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
      },
      item: items,
    };

    return JSON.stringify(collection, null, 2);
  } catch (e) {
    return `// Error: ${(e as Error).message}`;
  }
}
