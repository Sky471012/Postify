// --------------------------------------------
// function to find place to add my input area
// --------------------------------------------
function waitForElement(selector, callback) {
  const observer = new MutationObserver(() => {
    const target = document.querySelector(selector);
    if (target) {
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

    //finding post button
    const selector = '.share-actions__primary-action.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view'
    const observer = new MutationObserver(() => {
      const targetElement = document.querySelector(selector);

      if (targetElement) {
        
        
        targetElement.addEventListener('click', () => {
          
          const userNameElement = document.querySelector('.text-body-large-bold.truncate');
          const userName = userNameElement.textContent.trim();
          
          const postElement = document.querySelector('[role="textbox"]');
          const post = postElement.querySelector('p');
          const postContent = post.textContent.trim();


          fetch(`http://localhost:5000/api/users/exists?name=${encodeURIComponent(userName)}`)
          .then(res => res.json())
          .then(data => {
            if (data.exists) {
              console.log('User already exists, adding post...');

              // Add post to existing user
              fetch('http://localhost:5000/api/users/add-post', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  name: userName,
                  post: postContent
                })
              })
                .then(res => res.json())
                .then(data => console.log('Post added to user:', data))
                .catch(err => console.error('Error adding post:', err));

            } else {
              // Create new user with post
              fetch('http://localhost:5000/api/users/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  name: userName,
                  post: postContent
                })
              })
                .then(res => res.json())
                .then(data => console.log('User created!'))
                .catch(err => console.error('Error creating user!'));
            }
          })
          .catch(err => console.error('Error checking user existence:', err));
        });
      }
      observer.disconnect();
    
    })
    observer.observe(document.body, { childList: true, subtree: true });



    
    if (postBox) {
      postBox.innerHTML = '';
      postBox.focus();
      insertTextIntoContentEditable(postBox, generatedPost);
      
      // Re-enable the button
      const button = document.querySelector('#postify-generate-btn');
      const input = document.querySelector('#postify-input');
      if (button && input) {
        button.disabled = false;
        button.textContent = '↑';
        input.placeholder = 'Generate with Postify......';
      }
    } else {
      alert('Could not find the LinkedIn post area.');
    }
  } 
  else if (message.action === 'postGenerationFailed') {
    alert('Error generating post: ' + (message.error || 'Unknown error'));
    
    // Re-enable the button
    const button = document.querySelector('#postify-generate-btn');
    const input = document.querySelector('#postify-input');
    if (button) {
      button.disabled = false;
      button.textContent = '↑';
      input.placeholder = 'Generate with Postify......';
    }
  }
});


// Inject Postify UI next to LinkedIn's detour button
waitForElement('[class="share-creation-state__additional-toolbar share-creation-state__additional-toolbar--no-padding"]', (targetElement) => {
  if (document.getElementById('postify-container')) return;

  const container = document.createElement('div');
  container.id = 'postify-container';
  container.style.display = 'flex';
  container.style.gap = '8px';
  container.style.marginTop = '8px';
  container.style.border = '1.5px solid #fe7a7b';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'space-around';
  container.style.borderRadius = '50px';
  container.style.padding = '10px';
  container.style.backgroundColor= '#1d2430';

  const logo = document.createElement('img');
  logo.id = 'postify-logo';
  logo.src = chrome.runtime.getURL('src/assets/logo.png');
  logo.style.height = '35px';
  logo.style.margin = '0';
  
  const input = document.createElement('input');
  input.id = 'postify-input';
  input.type = 'text';
  input.placeholder = 'Generate with Postify......';
  input.style.padding = '6px';
  input.style.flex = '1';
  input.style.border = 'none';
  input.style.boxShadow = 'none';
  input.style.outline = 'none';
  input.style.color = 'white';
  input.style.backgroundColor = '#1d2430';
  const style = document.createElement('style');
  style.textContent = `
    #postify-input::placeholder {
      color: white;
      opacity: 0.5;
    }
  `;
  document.head.appendChild(style);


  const button = document.createElement('button');
  button.id = 'postify-generate-btn';
  button.textContent = '↑';
  button.style.fontSize = '2rem';
  button.style.background = 'linear-gradient(to right, #fe8464 0%, #fe6e9a 50%, #fe8464 100%)';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.borderRadius = '50%';
  button.style.minHeight = '35px';
  button.style.minWidth = '35px';
  button.style.cursor = 'pointer';

  button.onclick = () => {
    const prompt = input.value.trim();
    if (!prompt) return alert('Please enter a prompt.');
    
    button.disabled = true;
    button.textContent = '→';
    input.value="";
    input.placeholder = 'Generating......';
    
    // Send message to background script
    chrome.runtime.sendMessage(
      { action: 'generatePost', prompt },
      (response) => {
        // This only confirms the message was received
        // The actual result will come through the message listener
        if (!response) {
          console.error("No response from background script");
          button.disabled = false;
          button.textContent = '↑';
          input.placeholder = 'Generate with Postify......';
          alert('Error: Could not communicate with backend. Check console for details.');
        }
      }
    );
  };
  
  container.appendChild(logo);
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


// --------------------------------------------
// .........Adding edit buttons----------------
// --------------------------------------------
waitForElement('[class="share-creation-state__additional-toolbar share-creation-state__additional-toolbar--no-padding"]', (targetElement) => {
  if (document.getElementById('editContainer')) return;
  const editContainer = document.createElement('div');
  editContainer.id = 'editContainer';
  editContainer.style.display = 'flex';
  editContainer.style.gap = '30px';
  editContainer.style.marginRight = '20px';
  editContainer.style.alignItems = 'center';
  editContainer.style.justifyContent = 'flex-start';

  function createFormatButton(iconSVG, tooltip, clickHandler) {
    const btn = document.createElement('button');
    btn.innerHTML = iconSVG;
    btn.title = tooltip;
    btn.style.padding = '4px 8px';
    btn.style.borderRadius = '4px';
    btn.style.cursor = 'pointer';
    btn.style.background = '#3b3b3b';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.onclick = clickHandler;
    return btn;
  }
  
// SVG Icons
const boldIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4h8a4 4 0 010 8H6zm0 8h9a4 4 0 010 8H6z" stroke="white" stroke-width="2"/>
                  </svg>`;

const italicIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M19 4h-9m5 0l-6 16m-4 0h9" stroke="white" stroke-width="2"/>
                    </svg>`;

// const bulletIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <circle cx="5" cy="6" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="5" cy="18" r="2"/>
//                       <line x1="10" y1="6" x2="21" y2="6" stroke="black" stroke-width="2"/>
//                       <line x1="10" y1="12" x2="21" y2="12" stroke="black" stroke-width="2"/>
//                       <line x1="10" y1="18" x2="21" y2="18" stroke="black" stroke-width="2"/>
//                     </svg>`;

// const numberIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                       <text x="2" y="8" font-size="6" font-family="sans-serif" fill="black">1.</text>
//                       <text x="2" y="14" font-size="6" font-family="sans-serif" fill="black">2.</text>
//                       <text x="2" y="20" font-size="6" font-family="sans-serif" fill="black">3.</text>
//                       <line x1="10" y1="6" x2="21" y2="6" stroke="black" stroke-width="2"/>
//                       <line x1="10" y1="12" x2="21" y2="12" stroke="black" stroke-width="2"/>
//                       <line x1="10" y1="18" x2="21" y2="18" stroke="black" stroke-width="2"/>
//                     </svg>`;


  const boldButton = createFormatButton(boldIcon, 'Bold text', () => applyFormatting('bold'));
  const italicButton = createFormatButton(italicIcon, 'Italic text', () => applyFormatting('italic'));
  // const bulletButton = createFormatButton(bulletIcon, 'Bullet list', () => applyFormatting('bulletList'));
  // const numberButton = createFormatButton(numberIcon, 'Numbered list', () => applyFormatting('numberList'));


  editContainer.appendChild(boldButton);
  editContainer.appendChild(italicButton);
  // editContainer.appendChild(bulletButton);
  // editContainer.appendChild(numberButton);

  targetElement.appendChild(editContainer);
})


// Function to apply formatting to selected text in LinkedIn post box
function applyFormatting(format) {
  const postBox = document.querySelector('[contenteditable="true"][role="textbox"]');
  if (!postBox) {
    alert('Post box not found. Please click inside the LinkedIn post editor.');
    return;
  }

  postBox.focus();
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();
  if (!selectedText) return;

  let formattedText = '';

  switch (format) {
    case 'bold':
      formattedText = selectedText.split('').map(c => boldMap[c] || c).join('');
      break;
    case 'italic':
      formattedText = selectedText.split('').map(c => italicMap[c] || c).join('');
      break;
    default:
      formattedText = selectedText;
  }

  // Replace selection with formatted text
  const newNode = document.createTextNode(formattedText);
  range.deleteContents();
  range.insertNode(newNode);

  // Move cursor after inserted node
  range.setStartAfter(newNode);
  range.setEndAfter(newNode);
  selection.removeAllRanges();
  selection.addRange(range);

  // Trigger input so LinkedIn detects the change
  postBox.dispatchEvent(new InputEvent('input', { bubbles: true }));
}

const boldMap = {
  A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚',
  H: '𝗛', I: '𝗜', J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡',
  O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥', S: '𝗦', T: '𝗧', U: '𝗨',
  V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
  a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴',
  h: '𝗵', i: '𝗶', j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻',
  o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿', s: '𝘀', t: '𝘁', u: '𝘂',
  v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇'
};

const italicMap = {
  A: '𝘈', B: '𝘉', C: '𝘊', D: '𝘋', E: '𝘌', F: '𝘍', G: '𝘎',
  H: '𝘏', I: '𝘐', J: '𝘑', K: '𝘒', L: '𝘓', M: '𝘔', N: '𝘕',
  O: '𝘖', P: '𝘗', Q: '𝘘', R: '𝘙', S: '𝘚', T: '𝘛', U: '𝘜',
  V: '𝘝', W: '𝘞', X: '𝘟', Y: '𝘠', Z: '𝘡',
  a: '𝘢', b: '𝘣', c: '𝘤', d: '𝘥', e: '𝘦', f: '𝘧', g: '𝘨',
  h: '𝘩', i: '𝘪', j: '𝘫', k: '𝘬', l: '𝘭', m: '𝘮', n: '𝘯',
  o: '𝘰', p: '𝘱', q: '𝘲', r: '𝘳', s: '𝘴', t: '𝘵', u: '𝘶',
  v: '𝘷', w: '𝘸', x: '𝘹', y: '𝘺', z: '𝘻'
};
