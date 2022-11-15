Module.register("MMM-LokiFrame", {
  nextPhotoPath: null,
  prevPhotoPath: null,
  start: function () {
    this.sendSocketNotification("GET_FIRST_IMAGES");
  },
  createImg: function (path) {
    let imgWrapper = document.createElement("div");
    let img = document.createElement("img");
    imgWrapper.classList.add("image");
    let backgroundImg = document.createElement("img");
    backgroundImg.classList.add("background");
    if (path) {
      img.src = `/photos/${path}`;
      backgroundImg.src = `/photos/${path}`;
    }
    imgWrapper.appendChild(backgroundImg);
    imgWrapper.appendChild(img);
    return imgWrapper;
  },
  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.classList.add("fullscreen");
    let topImg = this.createImg(this.prevPhotoPath);
    let btmImg = this.createImg(this.nextPhotoPath);
    if (this.nextPhotoPath) {
      topImg.classList.add("fadeOut");
    }
    wrapper.appendChild(btmImg);
    wrapper.appendChild(topImg);
    return wrapper;
  },
  getStyles() {
    return ["lokiFrame.css"];
  },
  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "GET_FIRST_IMAGES":
      case "GET_NEXT_IMAGE":
        this.nextPhotoPath = payload.nextPath;
        this.prevPhotoPath = payload.prevPath;
        this.updateDom();
        break;
      default:
        break;
    }
  },
});
