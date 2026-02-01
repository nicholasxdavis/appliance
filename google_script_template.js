const CONFIG = {
  GITHUB_TOKEN: "YOUR_GITHUB_TOKEN_HERE", // Keep the "ghp_" part
  REPO_OWNER: "nicholasxdavis",           // e.g. "nicholasxdavis"
  REPO_NAME: "appliance"                  // e.g. "appliance"
};

// DO NOT EDIT BELOW THIS LINE
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const type = data.type || "Contact";
    
    // 1. Get existing inbox.json
    const url = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/contents/inbox.json`;
    const options = {
      method: "get",
      headers: {
        "Authorization": "token " + CONFIG.GITHUB_TOKEN,
        "Accept": "application/vnd.github.v3+json"
      }
    };
    
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    
    // Check if file exists, if not initialize empty
    let messages = [];
    let sha = null;
    
    if (response.getResponseCode() === 200) {
      const json = JSON.parse(response.getContentText());
      sha = json.sha;
      const decoded = Utilities.base64Decode(json.content);
      const jsonStr = Utilities.newBlob(decoded).getDataAsString();
      messages = JSON.parse(jsonStr);
    }
    
    // 2. Add new message
    const newMessage = {
      id: new Date().getTime().toString(),
      date: new Date().toISOString(),
      type: type,
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      message: data.message,
      service: data.service || "" // For quotes
    };
    
    messages.unshift(newMessage); // Add to top
    
    // 3. Save back to GitHub
    const newContent = Utilities.base64Encode(JSON.stringify(messages, null, 2));
    
    const payload = {
      message: `New ${type} Form Submission: ${data.name}`,
      content: newContent,
      sha: sha // Required if updating
    };
    
    const putOptions = {
      method: "put",
      headers: {
        "Authorization": "token " + CONFIG.GITHUB_TOKEN,
        "Accept": "application/vnd.github.v3+json"
      },
      payload: JSON.stringify(payload)
    };
    
    UrlFetchApp.fetch(url, putOptions);
    
    // Return Success (CORS workaround)
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  // Handle CORS preflight
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}
