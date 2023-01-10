const { google } = require("googleapis");
const { readFile, writeFile, unlink, access } = require("fs/promises");
const Log = require("logger");

let oauth2Client;
let tokenPath;
let calendarsPath;
let loggedIn = false;
let calendars = [];

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
  return null;
}

async function init(path) {
  let data = await readFile(`${path}/credentials.json`, "utf-8");
  tokenPath = `${path}/token.json`;
  calendarsPath = `${path}/calendars.json`;
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
    login(prevToken);
  }
}

async function obtainToken(codeAuth) {
  const { tokens } = await oauth2Client.getToken(codeAuth);
  saveToken(tokens);
  login(tokens);
}

async function login(tokens) {
  oauth2Client.setCredentials(tokens);
  calendars = await getUserCalendars();
  loggedIn = true;
}

function isLoggedIn() {
  return loggedIn;
}

async function logout() {
  if (!loggedIn) {
    return;
  }
  loggedIn = false;
  try {
    oauth2Client.revokeCredentials();
    await unlink(tokenPath);
    await unlink(calendarsPath);
  } catch (err) {}
}

async function getAPICalendars() {
  if (!isLoggedIn) {
    return [];
  }
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const res = await calendar.calendarList.list();
  return res.data.items.map((cal) => ({
    id: cal.id,
    summary: cal.summary,
    enabled: true,
  }));
}

async function getUserCalendars() {
  try {
    let str = await readFile(calendarsPath, "utf-8");
    let data = JSON.parse(str);
    let apiData = await getAPICalendars();
    let notInCache = apiData.filter(
      (cal) => data.findIndex((d) => d.id === cal.id) == -1
    );
    let res = data.concat(notInCache);
    return res;
  } catch (err) {}
  return await getAPICalendars();
}

async function toggleCalendar(calendarId) {
  if (!isLoggedIn) {
    return [];
  }
  let cal = calendars.find((cal) => cal.id === calendarId);
  cal.enabled = !cal.enabled;
  await writeFile(calendarsPath, JSON.stringify(calendars));
  return calendars;
}

async function getEvents() {
  if (!isLoggedIn()) {
    return null;
  }
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  const startToday = new Date();
  const endToday = new Date();
  endToday.setHours(23, 59, 59, 999);
  let reqs = [];
  for (const cal of calendars.filter((cal) => cal.enabled)) {
    reqs.push(
      calendar.events.list({
        calendarId: cal.id,
        timeMin: startToday.toISOString(),
        timeMax: endToday.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
        maxResults: 8,
      })
    );
  }
  const res = await Promise.all(reqs);
  let events = res.reduce((acc, { data }) => acc.concat(data.items), []);
  events.sort(
    (a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime)
  );
  return events;
}

module.exports = {
  init,
  isLoggedIn,
  obtainToken,
  logout,
  getEvents,
  toggleCalendar,
  getUserCalendars,
};
