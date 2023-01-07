let hideableModule = ["clock", "weather", "calendarModule"];

Module.register("calendarModule", {
  events: null,
  refreshTimeout: null,
  start: function () {
    this.getEvents();
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    if (this.events?.length > 0) {
      const allDayEvents = this.events.filter((event) => event.start.date);
      const timedEvents = this.events.filter((event) => event.start.dateTime);
      wrapper.append(this.createAllDayEvents(allDayEvents));
      if (timedEvents.length > 0 && allDayEvents.length > 0) {
        let divider = document.createElement("hr");
        divider.classList.add("divider");
        wrapper.append(divider);
      }
      wrapper.append(this.createTimedEvents(timedEvents));
    }
    return wrapper;
  },
  createTimedEvents(events) {
    if (events.length < 1) {
      return "";
    }
    const wrapper = document.createElement("div");
    wrapper.classList.add("timed");
    for (const event of events) {
      const start = new Date(event.start.dateTime);
      const end = new Date(event.end.dateTime);
      const eventWrapper = document.createElement("div");
      eventWrapper.classList.add("event");
      if (Date.now() > start && Date.now() < end) {
        eventWrapper.classList.add("current");
      }
      const timer = document.createElement("span");
      timer.classList.add("time");
      timer.append(
        start.toLocaleTimeString("en-us", {
          timeStyle: "short",
        })
      );
      eventWrapper.append(timer);
      const title = document.createElement("span");
      title.classList.add("title");
      title.append(event.summary);
      eventWrapper.append(title);
      wrapper.append(eventWrapper);
    }
    return wrapper;
  },
  createAllDayEvents(events) {
    if (events.length < 1) {
      return "";
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("allDay");
    for (const event of events) {
      const eventWrapper = document.createElement("div");
      eventWrapper.classList.add("event");
      const title = document.createElement("span");
      title.classList.add("title");
      title.append(event.summary);
      eventWrapper.append(title);
      wrapper.append(eventWrapper);
    }
    return wrapper;
  },
  getStyles() {
    return ["calendarModule.css"];
  },
  getEvents() {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    this.sendSocketNotification("GET_EVENTS");
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
  getHeader() {
    return "Today's Agenda";
  },
  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "RECIEVE_EVENTS":
        this.events = payload;
        this.events.length > 0 ? this.show(1000) : this.hide(1000);
        let firstTimedEvent = this.events.find((event) => event.start.dateTime);
        if (firstTimedEvent) {
          const end = new Date(firstTimedEvent.end.dateTime);
          let timeout = end - Date.now();
          console.log(timeout);
          this.refreshTimeout = setTimeout(() => {
            this.getEvents();
          }, timeout);
        } else {
          let endDay = new Date();
          endDay.setHours(24, 0, 0, 0);
          let timeout = endDay - Date.now();
          this.refreshTimeout = setTimeout(() => {
            this.getEvents();
          }, timeout);
        }
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
