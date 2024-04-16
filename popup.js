const submitCodes = async (codes) => {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, { codes });
    const resultBox = document.querySelector('#result');
    if (response.result === 'success') {
      resultBox.innerText = "Code found :) Hit redeem on the page"
    } else if (response.result === 'failure') {
      resultBox.innerText = "All gone sorry :("
    } else {
      resultBox.innerText = "Hmm something didn't work :/"
    }
  };

  const button = document.querySelector('#submit');
  const textArea = document.querySelector('#codesArea');
  button.onclick = () => {
    const text = textArea.value;
    const codes = text.split('\n').filter((str) => str !== '');
    submitCodes(codes);
  }