const NodeHelper = require("node_helper");
const Log = require("logger");
let fs = require("fs");
const multer = require("multer");
const express = require("express");

const upload = multer({
  dest: "photos/",
});

const PAGE_SIZE = 20;

module.exports = NodeHelper.create({
  files: [],
  photoIndex: 0,
  interval: 10000,
  start: function () {
    this.files = fs.readdirSync(`${this.path}/photos`);
    this.expressApp
      .route("/photos")
      .post(upload.array("photos"), (req, res) => {
        Log.log(req.files);
        files.concat(req.files);
      })
      .delete(express.json(), (req, res) => {
        Log.log(req.body);
        res.json(req.body);
      })
      .get((req, res) => {
        res.send(this.files);
      });
    this.expressApp.get("/photos/:photoId", (req, res) => {
      const { photoId } = req.params;
      res.sendFile(`${this.path}/photos/${photoId}`);
    });
  },
  getNextFiles: function () {
    this.photoIndex += 1;
    this.photoIndex =
      this.photoIndex >= this.files.length ? 0 : this.photoIndex;
    let prevIndex =
      this.photoIndex - 1 < 0 ? this.files.length - 1 : this.photoIndex - 1;
    Log.log(`${this.photoIndex} : ${prevIndex}`);
    return {
      nextFile: this.files[this.photoIndex] || null,
      prevFile: this.files[prevIndex] || null,
    };
  },
  socketNotificationReceived: function (notification, payload) {
    if (notification === "GET_FIRST_IMAGES") {
      this.sendSocketNotification("GET_FIRST_IMAGES", {
        nextPath: this.files[this.photoIndex],
        prevPath: null,
      });
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.interval = setInterval(() => {
        const { nextFile, prevFile } = this.getNextFiles();
        Log.log("update");
        this.sendSocketNotification("GET_NEXT_IMAGE", {
          nextPath: nextFile,
          prevPath: prevFile,
        });
      }, this.interval);
    }
  },
});
