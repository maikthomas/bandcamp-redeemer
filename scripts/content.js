const waitUntil = async (predicate, interval = 500, timeout = 30 * 1000) => {
  const start = Date.now();

  let done = false;

  do {
    if (predicate()) {
      done = true;
    } else if (Date.now() > (start + timeout)) {
      throw new Error(`Timed out waiting for predicate to return true after ${timeout}ms.`);
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  } while (done !== true);
}

const waitUntilNotLoading = async () => {
  const isLoading = () => !!document.querySelector('#code-icon.loading');
  await waitUntil(() => !isLoading());
}


const tryCode = async (codeInput, code) => {
  const hasError = () => !!document.querySelector('#code .errormsg');
  codeInput.value = code;
  codeInput.dispatchEvent(new Event('input'));
  await new Promise((res) => setTimeout(() => res(), 100));
  await waitUntilNotLoading();
  if (!hasError()) {
  }
  return !hasError();
}

const tryCodes = async (codes) => {
  const codeInput = document.querySelector('#redeem-form #code  #code-input')

  for (let i = 0; i < codes.length; i++) {
    const isValidCode = await tryCode(codeInput, codes[i]);
    if (isValidCode) {
      return isValidCode;
    }
  }
}

chrome.runtime.onMessage.addListener(
    async function(request, sender, sendResponse) {
      if (request.codes) {
        const success = await tryCodes(request.codes);
        sendResponse({ result: success ? 'success': 'failure' });
      } else {
        sendResponse({ result: 'error' });
      }
    }
  );
