Module.register("photosModule", {
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
    let onLoad = null;
    if (path) {
      onLoad = new Promise((res, rej) => {
        img.onload = res;
      });
      let finalPath = `/photos/${path}`;
      img.src = finalPath;
      backgroundImg.src = finalPath;
    }
    imgWrapper.appendChild(backgroundImg);
    imgWrapper.appendChild(img);
    return [imgWrapper, onLoad];
  },
  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.classList.add("fullscreen");
    let [topImg] = this.createImg(this.prevPhotoPath);
    let [btmImg, onLoad] = this.createImg(this.nextPhotoPath);
    onLoad?.then((_) => {
      this.readyForNext(topImg);
    });
    wrapper.appendChild(btmImg);
    wrapper.appendChild(topImg);
    return wrapper;
  },
  readyForNext(topImg) {
    console.log("READY");
    topImg.classList.add("fadeOut");
    this.sendSocketNotification("READY_FOR_NEXT");
  },
  getStyles() {
    return ["photosModule.css"];
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
