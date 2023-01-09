const NodeHelper = require("node_helper");
const Log = require("logger");
const googleApi = require("./googleAPI");
const express = require("express");
const PAGE_SIZE = 20;

module.exports = NodeHelper.create({
  getModulesPromise: null,
  toggleModulePromise: null,
  start: function () {
    Log.log("init google");
    googleApi.init(this.path);
    if (googleApi.isLoggedIn()) {
      this.getEvents();
    }
    this.expressApp.post("/cal/authCode", express.json(), async (req, res) => {
      let { serverAuthCode } = req.body;
      Log.log("login");
      await googleApi.obtainToken(serverAuthCode);
      this.getEvents();
      res.end();
    });

    this.expressApp.get("/cal/logout", async (req, res) => {
      Log.log("logout");
      await googleApi.logout();
      this.getEvents();
      res.end();
    });
    this.expressApp.get("/cal/refresh", async (req, res) => {
      Log.log("refresh");
      this.getEvents();
      res.end();
    });
    this.expressApp
      .route("/cal/calendars")
      .get(async (req, res) => {
        let cals = await googleApi.getUserCalendars();
        Log.log("get Calendars", cals);
        res.json(cals);
      })
      .post(express.json(), async (req, res) => {
        let { calendarId } = req.body;
        let newCal = await googleApi.toggleCalendar(calendarId);
        Log.log("post Calendars", newCal);
        res.json(newCal);
        this.getEvents();
      });

    this.expressApp
      .route("/hide")
      .get(async (req, res) => {
        Log.log("hide");
        let modules = await this.getModulesHide();
        Log.log("modules " + JSON.stringify(modules));
        res.json(modules);
      })
      .post(express.json(), async (req, res) => {
        Log.log("new hide");
        let { module } = req.body;
        res.json(await this.toggleModuleHide(module));
      });
  },
  getEvents: async function () {
    this.sendSocketNotification("RECIEVE_EVENTS", await googleApi.getEvents());
  },
  toggleModuleHide: async function (module) {
    let promise = new Promise((res, rej) => {
      this.toggleModulePromise = res;
    });
    this.sendSocketNotification("TOGGLE_MODULE_HIDE", module);
    return promise;
  },
  getModulesHide: function () {
    let promise = new Promise((res, rej) => {
      this.getModulesPromise = res;
    });
    this.sendSocketNotification("GET_MODULES_HIDE");
    return promise;
  },
  socketNotificationReceived: function (notification, payload) {
    Log.log(notification, payload);
    switch (notification) {
      case "GET_EVENTS":
        this.getEvents();
        break;
      case "RECIEVE_MODULES_HIDE":
        this.toggleModulePromise(payload);
        break;
      case "RECIEVE_GET_MODULES_HIDDEN":
        this.getModulesPromise(payload);
        break;
      default:
        break;
    }
  },
});
