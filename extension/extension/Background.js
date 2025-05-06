chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generatePost') {
    // Immediately acknowledge receipt of message to keep connection alive
    sendResponse({ received: true });
    
    // Then handle the async operation
    fetch('http://localhost:5000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: request.prompt })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.generatedPost) {
        console.log("Success - generated post:", data.generatedPost);
        // Send the result back to content script
        chrome.tabs.sendMessage(sender.tab.id, { 
          action: 'postGenerated', 
          generatedPost: data.generatedPost 
        });
      } else {
        console.error("Invalid response:", data);
        chrome.tabs.sendMessage(sender.tab.id, { 
          action: 'postGenerationFailed', 
          error: 'Invalid server response' 
        });
      }
    })
    .catch(error => {
      console.error("Error generating post:", error);
      chrome.tabs.sendMessage(sender.tab.id, { 
        action: 'postGenerationFailed', 
        error: error.message || 'Unknown error' 
      });
    });
    
    // Return true to indicate we'll respond asynchronously
    return true;
  }
});