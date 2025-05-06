let urlMap = new Map();

// Function to update the urlMap from the stored object
function updateUrlMap(mappingsObj) {
  urlMap = new Map(Object.entries(mappingsObj));
  console.log('Updated urlMap:', urlMap);
}

// Load mappings from storage when the service worker starts
chrome.storage.local.get('urlMappings', (data) => {
  const initialMappingsObj = data.urlMappings || {};
  updateUrlMap(initialMappingsObj);
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  let urlWithoutProtocol = details.url;

  if (details.url.startsWith('http://')) {
    urlWithoutProtocol = details.url.substring(7); // Remove "http://" (length is 7)
  } else if (details.url.startsWith('https://')) {
    urlWithoutProtocol = details.url.substring(8); // Remove "https://" (length is 8)
  }

  console.log('urlWithoutProtocol:', urlWithoutProtocol);
  if (urlMap.has(urlWithoutProtocol)) {
    const destination = urlMap.get(urlWithoutProtocol);
    chrome.tabs.update(details.tabId, { url: destination });
  }
});

// Listen for messages from the popup to update mappings
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'updateMappings') {
    updateUrlMap(request.mappings);
  }
});