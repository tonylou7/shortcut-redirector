document.addEventListener('DOMContentLoaded', () => {
  const patternInput = document.getElementById('patternInput');
  const destinationInput = document.getElementById('destinationInput');
  const addButton = document.getElementById('addButton');
  const mappingsList = document.getElementById('mappingsList');

  // Load existing mappings when the popup opens
  loadMappings();

  addButton.addEventListener('click', () => {
    const pattern = patternInput.value.trim();
    const destination = destinationInput.value.trim();
    const patternRegex = /^[a-z]+\//;

    if (pattern && destination && patternRegex.test(pattern)) {
      addMappingToUI(pattern, destination);
      patternInput.value = '';
      destinationInput.value = '';
      saveMappings(getMappingsFromUI()); // Save immediately on add
    } else if (pattern && destination) {
      alert('Invalid pattern. Pattern must be in the format "[a-z]+/".');
    } else {
      alert('Please enter both a pattern and a destination URL.');
    }
  });

  function addMappingToUI(pattern, destination) {
    const listItem = document.createElement('li');
    listItem.classList.add('mapping');
    listItem.innerHTML = `
      <div class="mapping-text">${pattern} <span> -> </span> ${destination}</div>
      <button class="removeButton" data-pattern="${pattern}">Remove</button>
    `;
    mappingsList.appendChild(listItem);

    const removeButton = listItem.querySelector('.removeButton');
    removeButton.addEventListener('click', (event) => {
      const patternToRemove = event.target.dataset.pattern;
      removeMappingFromUI(listItem, patternToRemove);
      saveMappings(getMappingsFromUI()); // Save immediately on remove
    });
  }

  function removeMappingFromUI(listItem, patternToRemove) {
    listItem.remove();
  }

  function getMappingsFromUI() {
    const mappingsMap = new Map();
    const mappingElements = mappingsList.querySelectorAll('.mapping');
    mappingElements.forEach(element => {
      const mappingText = element.querySelector('.mapping-text').textContent.split(' -> ');
      if (mappingText.length === 2) {
        const pattern = mappingText[0].trim();
        const destination = mappingText[1].trim();
        if (pattern && destination) {
          mappingsMap.set(pattern, destination);
        }
      }
    });
    // Convert the Map to a plain object for storage
    return Object.fromEntries(mappingsMap);
  }

  function loadMappings() {
    chrome.storage.local.get('urlMappings', (data) => {
      const mappingsObj = data.urlMappings || {};
      const mappingsMap = new Map(Object.entries(mappingsObj));
      mappingsMap.forEach((destination, pattern) => {
        addMappingToUI(pattern, destination);
      });
    });
  }

  function saveMappings(mappingsObj) {
    chrome.storage.local.set({ 'urlMappings': mappingsObj }, () => {
      chrome.runtime.sendMessage({ action: 'updateMappings', mappings: mappingsObj });
    });
  }
});