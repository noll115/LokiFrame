const NodeHelper = require("node_helper");
const Log = require("logger");
let fs = require("fs/promises");
let fsSync = require("fs");
const multer = require("multer");
const express = require("express");

const PAGE_SIZE = 20;

module.exports = NodeHelper.create({
  files: [],
  photoIndex: 0,
  interval: 10000,
  start: function () {
    const photoPath = `${this.path}/photos`;
    this.files = fsSync.readdirSync(photoPath);
    this.upload = multer({
      storage: multer.diskStorage({
        destination: photoPath,
        filename: (req, file, cb) => {
          const fileTypeIndex = file.originalname.lastIndexOf(".");
          const fileName = file.originalname.substring(0, fileTypeIndex);
          const fileType = file.originalname.substring(fileTypeIndex);
          const finalName = `${Date.now()}-${fileName}${fileType}`;
          cb(null, finalName);
        },
      }),
    });
    this.expressApp
      .route("/photos")
      .post(this.upload.array("photos"), (req, res) => {
        this.files = this.files.concat(req.files.map((file) => file.filename));
        Log.log(this.files);
        res.json(this.files);
      })
      .delete(express.json(), async (req, res) => {
        let deletes = [];
        for (const fileName of req.body) {
          deletes.push(fs.unlink(`${photoPath}/${fileName}`));
        }
        await Promise.all(deletes);
        this.files = fsSync.readdirSync(photoPath);
        res.end();
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
