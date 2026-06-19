console.log('[Postify] content script loaded');

// ----------------------------------------------------------------------------
// LinkedIn renders the post composer inside an OPEN Shadow DOM, so plain
// document.querySelector cannot reach any of its elements. Every lookup below
// must pierce shadow roots via deepQuery().
// ----------------------------------------------------------------------------
function deepQuery(selector, root = document) {
  const direct = root.querySelector(selector);
  if (direct) return direct;
  const nodes = root.querySelectorAll('*');
  for (const node of nodes) {
    if (node.shadowRoot) {
      const found = deepQuery(selector, node.shadowRoot);
      if (found) return found;
    }
  }
  return null;
}

// Resolve when `selector` appears (polls deepQuery). Resolves null if it never shows.
function findEventually(selector, { tries = 40, interval = 250 } = {}) {
  return new Promise((resolve) => {
    let n = 0;
    const tick = () => {
      const el = deepQuery(selector);
      if (el) return resolve(el);
      if (++n >= tries) return resolve(null);
      setTimeout(tick, interval);
    };
    tick();
  });
}

// The emoji lives in .share-creation-state__additional-toolbar; we mount the
// Postify UI right above it, inside the same toolbar group.
const ANCHOR_SELECTOR = '.share-creation-state__additional-toolbar';

// Run the injector after DOM activity. A MutationObserver only sees the root it
// observes — but LinkedIn keeps a persistent shadow host and rebuilds the composer
// INSIDE its shadow root, which the light-DOM observer can't see (that was the lag
// on reopen). So we observe the light DOM up front and additionally observe the
// composer's shadow root once we find it. After any activity we burst-poll for
// ~1.5s to catch the shadow content filling in.
const observedRoots = new WeakSet();
let kickWatcher = () => {};

function observeRoot(root) {
  if (!root || observedRoots.has(root)) return;
  observedRoots.add(root);
  new MutationObserver(() => kickWatcher()).observe(root, { childList: true, subtree: true });
}

function startComposerWatcher(inject) {
  let burstUntil = 0;
  let timer = null;
  const burst = () => {
    inject();
    if (performance.now() < burstUntil) {
      timer = setTimeout(burst, 120);
    } else {
      timer = null;
    }
  };
  kickWatcher = () => {
    burstUntil = performance.now() + 1500;
    if (!timer) burst();
  };
  observeRoot(document.documentElement);
  kickWatcher();
}

// Set up message listener for background script responses
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);

  if (message.action === 'postGenerated') {
    const generatedPost = message.generatedPost;
    const postBox = deepQuery('[contenteditable="true"][role="textbox"]');

    // Save the post to the backend when the user clicks LinkedIn's Post button
    attachPostSaveListener();

    if (postBox) {
      insertTextIntoContentEditable(postBox, generatedPost);

      // Re-enable the button
      const button = deepQuery('#postify-generate-btn');
      const input = deepQuery('#postify-input');
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
    const button = deepQuery('#postify-generate-btn');
    const input = deepQuery('#postify-input');
    if (button) {
      button.disabled = false;
      button.textContent = '↑';
      if (input) input.placeholder = 'Generate with Postify......';
    }
  }
});

// Attach a one-time click listener on LinkedIn's "Post" button to persist the post.
function attachPostSaveListener() {
  findEventually('.share-actions__primary-action').then((postBtn) => {
    if (!postBtn || postBtn.dataset.postifyBound) return;
    postBtn.dataset.postifyBound = '1';

    postBtn.addEventListener('click', () => {
      const userNameElement = deepQuery('.text-body-large-bold.truncate');
      const editor = deepQuery('[role="textbox"]');
      if (!userNameElement || !editor) return;

      const userName = userNameElement.textContent.trim();
      // Quill stores each line as its own <p>, so read ALL paragraphs (not just the
      // first) and join with newlines; fall back to innerText/textContent.
      const blocks = editor.querySelectorAll('p');
      const postContent = (blocks.length
        ? Array.from(blocks).map(p => p.textContent).join('\n')
        : (editor.innerText || editor.textContent)
      ).trim();

      fetch(`https://postify-pd8m.onrender.com/api/users/exists?name=${encodeURIComponent(userName)}`)
        .then(res => res.json())
        .then(data => {
          if (data.exists) {
            console.log('User already exists, adding post...');
            fetch('https://postify-pd8m.onrender.com/api/users/add-post', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: userName, post: postContent })
            })
              .then(res => res.json())
              .then(data => console.log('Post added to user:', data))
              .catch(err => console.error('Error adding post:', err));
          } else {
            fetch('https://postify-pd8m.onrender.com/api/users/create', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: userName, post: postContent })
            })
              .then(res => res.json())
              .then(() => console.log('User created!'))
              .catch(err => console.error('Error creating user!'));
          }
        })
        .catch(err => console.error('Error checking user existence:', err));
    });
  });
}

// Ensure the ::placeholder style lives in the same root (shadow) as the input.
function ensurePlaceholderStyle(mount) {
  const root = mount.getRootNode();
  if (root.querySelector('#postify-style')) return;
  const style = document.createElement('style');
  style.id = 'postify-style';
  style.textContent = `#postify-input::placeholder { color: white; opacity: 0.5; }`;
  (root.head || root).appendChild(style);
}

// Build the Postify input row (logo + prompt input + generate button).
function buildPostifyRow() {
  const container = document.createElement('div');
  container.id = 'postify-container';
  container.style.display = 'flex';
  container.style.width = '100%';
  container.style.boxSizing = 'border-box';
  container.style.gap = '8px';
  container.style.marginBottom = '8px';
  container.style.border = '1.5px solid #fe7a7b';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'space-around';
  container.style.borderRadius = '50px';
  container.style.padding = '10px';
  container.style.backgroundColor = '#1d2430';

  const logo = document.createElement('img');
  logo.id = 'postify-logo';
  // Guard against an orphaned/invalidated extension context (returns chrome-extension://invalid/)
  if (chrome.runtime?.id) {
    logo.src = chrome.runtime.getURL('src/assets/logo.png');
  }
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
    input.value = "";
    input.placeholder = 'Generating......';

    // Send message to background script
    chrome.runtime.sendMessage(
      { action: 'generatePost', prompt },
      (response) => {
        // This only confirms the message was received;
        // the actual result arrives through the message listener.
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
  return container;
}

// Inject the Postify UI right above the emoji toolbar, in the same group.
// Idempotent + self-healing: the watcher calls this repeatedly; the isConnected
// check keeps it cheap once mounted, and it re-injects if LinkedIn wipes it.
let postifyRowEl = null;
function injectPostifyUI() {
  if (postifyRowEl && postifyRowEl.isConnected) return; // already present — cheap path
  postifyRowEl = null;

  const anchor = deepQuery(ANCHOR_SELECTOR);
  if (!anchor || !anchor.parentElement) return;
  const parent = anchor.parentElement;

  // Observe the composer's shadow root so reopening it (a shadow-internal rebuild,
  // invisible to the light-DOM observer) kicks the watcher and re-injects fast.
  observeRoot(anchor.getRootNode());

  ensurePlaceholderStyle(anchor);
  console.log('[Postify] injecting UI');

  const container = buildPostifyRow();
  parent.insertBefore(container, anchor); // directly above the emoji row
  postifyRowEl = container;

  // Format buttons go just under the Postify row, above the emoji
  const editContainer = buildEditButtons();
  container.insertAdjacentElement('afterend', editContainer);
}

startComposerWatcher(injectPostifyUI);


// --------------------------------------------
// .........Function to find text-box----------
// --------------------------------------------
function insertTextIntoContentEditable(element, text) {
  // LinkedIn's editor is Quill, which keeps its own model — directly mutating the
  // DOM (textContent / inserting nodes) gets reverted. Drive it via execCommand so
  // the beforeinput/input events Quill listens to fire normally.
  element.focus();

  // Selection lives on the shadow root in Chrome; fall back to window selection.
  const root = element.getRootNode();
  const selection = (root.getSelection && root.getSelection()) || window.getSelection();

  // Select the editor's current contents (the empty <p><br></p>) so insertText replaces it.
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);

  const inserted = document.execCommand('insertText', false, text);
  if (inserted) return; // execCommand fires the input events itself

  // Fallback: manual insertion + synthetic input event
  range.deleteContents();
  const textNode = document.createTextNode(text);
  range.insertNode(textNode);
  range.setStartAfter(textNode);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  element.dispatchEvent(new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    inputType: 'insertText',
    data: text
  }));
}


// --------------------------------------------
// .........Adding edit buttons----------------
// --------------------------------------------
function buildEditButtons() {
  const editContainer = document.createElement('div');
  editContainer.id = 'editContainer';
  editContainer.style.display = 'flex';
  editContainer.style.gap = '30px';
  editContainer.style.marginRight = '20px';
  editContainer.style.marginBottom = '8px';
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

  const boldButton = createFormatButton(boldIcon, 'Bold text', () => applyFormatting('bold'));
  const italicButton = createFormatButton(italicIcon, 'Italic text', () => applyFormatting('italic'));

  editContainer.appendChild(boldButton);
  editContainer.appendChild(italicButton);
  return editContainer;
}


// Function to apply formatting to selected text in LinkedIn post box
function applyFormatting(format) {
  const postBox = deepQuery('[contenteditable="true"][role="textbox"]');
  if (!postBox) {
    alert('Post box not found. Please click inside the LinkedIn post editor.');
    return;
  }

  postBox.focus();
  // In a shadow tree, the selection lives on the shadow root in Chrome.
  const root = postBox.getRootNode();
  const selection = (root.getSelection && root.getSelection()) || window.getSelection();
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
