// --------------------------------------------
// function to find place to add my input area
// --------------------------------------------
function waitForElement(selector, callback) {
  const observer = new MutationObserver(() => {
    const target = document.querySelector(selector);
    if (target) {
      observer.disconnect();
      callback(target);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Set up message listener for background script responses
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  
  if (message.action === 'postGenerated') {
    const generatedPost = message.generatedPost;
    const postBox = document.querySelector('[contenteditable="true"][role="textbox"]');
    
    if (postBox) {
      postBox.focus();
      insertTextIntoContentEditable(postBox, generatedPost);
      
      // Re-enable the button
      const button = document.querySelector('#postify-generate-btn');
      if (button) {
        button.disabled = false;
        button.textContent = 'Generate';
      }
    } else {
      alert('Could not find the LinkedIn post area.');
    }
  } 
  else if (message.action === 'postGenerationFailed') {
    alert('Error generating post: ' + (message.error || 'Unknown error'));
    
    // Re-enable the button
    const button = document.querySelector('#postify-generate-btn');
    if (button) {
      button.disabled = false;
      button.textContent = 'Generate';
    }
  }
});

// Inject Postify UI next to LinkedIn's detour button
waitForElement('[class="artdeco-carousel__slider ember-view"]', (targetElement) => {
  if (document.getElementById('postify-container')) return;

  const container = document.createElement('li');
  container.id = 'postify-container';
  container.style.display = 'flex';
  container.style.gap = '8px';
  container.style.marginTop = '8px';
  container.style.alignItems = 'center';

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Enter your prompt...';
  input.style.padding = '6px';
  input.style.flex = '1';
  input.style.border = '1px solid #ccc';
  input.style.borderRadius = '4px';

  const button = document.createElement('button');
  button.id = 'postify-generate-btn'; // Added ID for easier reference
  button.textContent = 'Generate';
  button.style.padding = '6px 10px';
  button.style.background = '#0A66C2';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';

  button.onclick = () => {
    const prompt = input.value.trim();
    if (!prompt) return alert('Please enter a prompt.');
    
    button.disabled = true;
    button.textContent = 'Generating...';
    
    // Send message to background script
    chrome.runtime.sendMessage(
      { action: 'generatePost', prompt },
      (response) => {
        // This only confirms the message was received
        // The actual result will come through the message listener
        if (!response) {
          console.error("No response from background script");
          button.disabled = false;
          button.textContent = 'Generate';
          alert('Error: Could not communicate with backend. Check console for details.');
        }
      }
    );
  };
  
  container.appendChild(input);
  container.appendChild(button);
  targetElement.parentElement.appendChild(container);
});


// --------------------------------------------
// .........Function to find text-box----------
// --------------------------------------------
function insertTextIntoContentEditable(element, text) {
  // Focus the element first
  element.focus();
  
  // Get the current selection
  const selection = window.getSelection();
  
  // Check if there's a selection range
  if (selection.rangeCount > 0) {
    // Get the first range
    const range = selection.getRangeAt(0);
    
    // Delete any currently selected content
    range.deleteContents();
    
    // Create a text node with the content to insert
    const textNode = document.createTextNode(text);
    
    // Insert the text node
    range.insertNode(textNode);
    
    // Move the cursor to the end of the inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    // If no selection range, just append the text to the element
    element.textContent += text;
  }
  
  // Trigger an input event to ensure LinkedIn registers the change
  const inputEvent = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    inputType: 'insertText',
    data: text
  });
  element.dispatchEvent(inputEvent);
}
