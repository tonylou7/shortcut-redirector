chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const shortcuts = {
      'c/': 'https://calendar.google.com/',
      'y/': 'https://www.youtube.com/',
      'g/': 'https://www.google.com/',
      'r/': 'https://www.reddit.com/',
      // add more shortcuts here
    };

    const typed = changeInfo.url;

    for (const key in shortcuts) {
      if (typed.endsWith(key)) {
        chrome.tabs.update(tabId, { url: shortcuts[key] });
        break;
      }
    }
  }
});
