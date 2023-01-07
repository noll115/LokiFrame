const { google } = require("googleapis");
const { readFile, writeFile, unlink, access } = require("fs/promises");
const Log = require("logger");

let oauth2Client;
let tokenPath;
let loggedIn = false;

async function saveToken(newToken) {
  let prevToken = getToken();
  let finalToken = { ...prevToken, ...newToken };
  await writeFile(tokenPath, JSON.stringify(finalToken));
}

async function getToken() {
  try {
    let data = await readFile(tokenPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {}
  return {};
}

async function init(path) {
  let data = await readFile(`${path}/credentials.json`, "utf-8");
  tokenPath = `${path}/token.json`;
  let creds = JSON.parse(data);
  oauth2Client = new google.auth.OAuth2({
    clientId: creds.web.client_id,
    clientSecret: creds.web.client_secret,
    redirectUri: "",
  });
  oauth2Client.on("tokens", (tokens) => {
    if (tokens.refresh_token) {
      saveToken({ refresh_token: tokens.refresh_token });
    }
  });
  let prevToken = await getToken();
  if (prevToken) {
    oauth2Client.setCredentials(prevToken);
    loggedIn = true;
  }
}

async function login(codeAuth) {
  const { tokens } = await oauth2Client.getToken(codeAuth);
  saveToken(tokens);
  oauth2Client.setCredentials(tokens);
  loggedIn = true;
}

function isLoggedIn() {
  return loggedIn;
}

async function logout() {
  oauth2Client.revokeCredentials();
  try {
    await unlink(tokenPath);
  } catch (err) {}
}

async function getEvents() {
  if (!isLoggedIn) {
    return null;
  }
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const startToday = new Date();
  const endToday = new Date();
  endToday.setHours(23, 59, 59, 999);
  Log.log(startToday.toISOString(), endToday.toISOString());
  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: startToday.toISOString(),
    timeMax: endToday.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });
  let events = res.data.items;
  Log.log(events);
  return events;
}

module.exports = { init, isLoggedIn, login, logout, getEvents };
