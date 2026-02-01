// 1. Copy this content
// 2. Go to https://script.google.com/home
// 3. New Project -> Paste this code
// 4. Update the CONFIG object below with your details
// 5. Deploy -> New Deployment -> Web App -> execute as "Me" -> Access "Anyone"
// 6. Copy the "Web App URL" and paste it into your Admin Panel (Global Settings)

const CONFIG = {
  GITHUB_TOKEN: "YOUR_GITHUB_TOKEN_HERE", // Paste your GITHUB0API0KEY
  REPO_OWNER: "nicholasxdavis",
  REPO_NAME: "appliance",
  FILE_PATH: "inbox.json"
};

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // 1. Get current inbox content
    const getUrl = `https://api.github.com/repos/${CONFIG.REPO_OWNER}/${CONFIG.REPO_NAME}/contents/${CONFIG.FILE_PATH}`;
    const getOptions = {
      method: "get",
      headers: { "Authorization": "token " + CONFIG.GITHUB_TOKEN }
    };
    
    const getRes = UrlFetchApp.fetch(getUrl, getOptions);
    const fileData = JSON.parse(getRes.getContentText());
    const currentInbox = JSON.parse(Utilities.newBlob(Utilities.base64Decode(fileData.content)).getDataAsString());
    
    // 2. Add new message
    const newMessage = {
      id: "msg_" + new Date().getTime(),
      date: new Date().toISOString(),
      name: data.name || "Anonymous",
      email: data.email || "No Email",
      phone: data.phone || "No Phone",
      message: data.message || "",
      type: data.type || "Contact" // 'Quote' or 'Contact'
    };
    
    currentInbox.unshift(newMessage); // Add to top
    
    // 3. Save back to GitHub
    const updatedContent = Utilities.base64Encode(JSON.stringify(currentInbox, null, 2));
    const payload = {
      message: `New Web Form Submission: ${newMessage.name}`,
      content: updatedContent,
      sha: fileData.sha
    };
    
    const putOptions = {
      method: "put",
      headers: { 
        "Authorization": "token " + CONFIG.GITHUB_TOKEN,
        "Content-Type": "application/json"
      },
      payload: JSON.stringify(payload)
    };
    
    UrlFetchApp.fetch(getUrl, putOptions);
    
    // 4. Return success
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Enable CORS for browser requests
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .append("Access-Control-Allow-Origin: *")
    .append("Access-Control-Allow-Methods: POST, GET, OPTIONS")
    .append("Access-Control-Allow-Headers: Content-Type");
}
