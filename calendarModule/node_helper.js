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
      await googleApi.login(serverAuthCode);
      this.getEvents();
      res.end();
    });

    this.expressApp.get("/cal/logout", async (req, res) => {
      Log.log("logout");
      await googleApi.logout();
      res.end();
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
