chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generatePost') {
    // Immediately acknowledge receipt of message to keep connection alive
    sendResponse({ received: true });
    
    // Add logging to help debug the request
    console.log("Sending request to backend with prompt:", request.prompt);
    
    // Check if server is reachable first
    fetch('http://localhost:5000/', { 
      method: 'GET',
      mode: 'cors'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Server health check failed: ${response.status}`);
      }
      console.log("Server is reachable, proceeding with post generation");
      
      // Then handle the actual post generation request
      return fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ prompt: request.prompt })
      });
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`API request failed with status: ${res.status}`);
      }
      return res.json();
    })
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
          error: data.error || 'Invalid server response' 
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
