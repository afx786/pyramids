const MOCK_DELAY = 250;

export function mockApiResponse(data, options = {}) {
  const { delay = MOCK_DELAY, shouldFail = false } = options;

  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Mock API request failed'));
        return;
      }

      resolve(structuredClone(data));
    }, delay);
  });
}
