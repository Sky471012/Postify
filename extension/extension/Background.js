chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'generatePost') {
    try {
      const res = await fetch('http://localhost:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: request.prompt })
      });

      const data = await res.json();

      if (data && data.generatedPost) {
        console.log(data.generatedPost);
        sendResponse({ generatedPost: data.generatedPost });
      } else {
        console.error("Invalid response:", data);
        sendResponse({ error: true });
      }

    } catch (error) {
      console.error(error);
      sendResponse({ error: true });
    }

    return true;
  }
});
