let hideableModule = ["clock", "weather", "calendarModule"];

Module.register("calendarModule", {
  events: null,
  start: function () {
    this.sendSocketNotification("GET_EVENTS");
  },

  getDom: function () {
    console.log(MM.getModules());
    const wrapper = document.createElement("div");
    if (this.events) {
      for (const event of this.events) {
        wrapper.append(event.summary);
      }
    }
    return wrapper;
  },
  getStyles() {
    return ["calendarModule.css"];
  },
  getModules() {
    return MM.getModules().filter((module) =>
      hideableModule.includes(module.name)
    );
  },
  getHiddenModules() {
    return this.getModules()
      .filter((module) => module.hidden)
      .map((module) => module.name);
  },
  toggleModuleHidden(moduleName) {
    let module = this.getModules().find((module) => module.name == moduleName);
    module.hidden ? module.show(1000) : module.hide(1000);
    return this.getHiddenModules();
  },
  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "RECIEVE_EVENTS":
        this.events = payload;
        this.updateDom();
        break;
      case "GET_MODULES_HIDE":
        this.sendSocketNotification(
          "RECIEVE_GET_MODULES_HIDDEN",
          this.getHiddenModules()
        );
        break;
      case "TOGGLE_MODULE_HIDE":
        this.sendSocketNotification(
          "RECIEVE_MODULES_HIDE",
          this.toggleModuleHidden(payload)
        );
        break;
    }
  },
});
