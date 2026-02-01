const fs = require("fs");
const path = require("path");

// Configuration
const CONFIG_FILE = path.join(__dirname, "js", "config.js");
const DIR = path.join(__dirname, "js");

// Ensure js directory exists
if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR);
}

// 1. Shim: Load local .env file (if exists) for Windows simulation
// This mimics how Codespaces injects secrets into the environment
const ENV_PATH = path.join(__dirname, '.env');
if (fs.existsSync(ENV_PATH)) {
    const envContent = fs.readFileSync(ENV_PATH, 'utf8');
    envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, ...parts] = line.split('=');
            const val = parts.join('=').trim(); // Handle values with =
            if (key && val) {
                process.env[key.trim()] = val;
            }
        }
    });
    console.log('Loaded local .env file for simulation.');
}

// 2. Read Environment Variables
const config = {
  auth: [
    {
      email: process.env.ENTRY0EMAIL1 || "",
      pass: process.env.ENTRY0PASSWORD1 || "",
    },
    {
      email: process.env.ENTRY0EMAIL2 || "",
      pass: process.env.ENTRY0PASSWORD2 || process.env.ENTRY0PASSOWRD2 || "",
    },
  ],
  github: {
    token: process.env.GITHUB0API0KEY || "",
  },
  scriptUrl: process.env.SCRIPT0URL || "",
};

// Generate Content
const fileContent = `
/**
 * AUTO-GENERATED CONFIG - DO NOT EDIT MANUALLY
 * Origin: GitHub Secrets / Environment Variables
 */
window.CONFIG = {
    VALID_USERS: ${JSON.stringify(config.auth)},
    GITHUB_TOKEN: "${config.github.token}",
    SCRIPT_URL: "${config.scriptUrl}"
};
console.log("Secure Configuration Loaded");
`;

// Write to file
fs.writeFileSync(CONFIG_FILE, fileContent.trim());

console.log("Successfully generated js/config.js");

// Debug Logging (Safe, usage masked)
const checkVar = (name, val) => {
    console.log(`${name}: ${val ? '✅ Present (Length: ' + val.length + ')' : '❌ MISSING (Empty/Undefined)'}`);
};

console.log('--- CREDENTIALS CHECK ---');
checkVar('ENTRY0EMAIL1', process.env.ENTRY0EMAIL1);
checkVar('ENTRY0PASSWORD1', process.env.ENTRY0PASSWORD1);
checkVar('ENTRY0EMAIL2', process.env.ENTRY0EMAIL2);
checkVar('ENTRY0PASSWORD2', process.env.ENTRY0PASSWORD2);
checkVar('GITHUB0API0KEY', process.env.GITHUB0API0KEY);
console.log('-------------------------');
