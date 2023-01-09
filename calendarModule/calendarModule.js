let hideableModule = ["clock", "weather", "calendarModule"];

let isCurrentEvent = (event) => {
  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);
  return Date.now() >= start && Date.now() <= end;
};

let divider = (text) => {
  const wrapper = document.createElement("div");
  wrapper.classList.add("divider");
  const textWrapper = document.createElement("span");
  textWrapper.classList.add("text");
  textWrapper.append(text);
  const divider = document.createElement("span");
  divider.classList.add("line");
  wrapper.append(textWrapper);
  wrapper.append(divider);
  return wrapper;
};

Module.register("calendarModule", {
  events: null,
  refreshTimeout: null,
  start: function () {
    console.log("start");
    this.getEvents();
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    if (this.events?.length > 0) {
      const allDayEvents = this.events.filter((event) => event.start.date);
      const timedEvents = this.events.filter((event) => event.start.dateTime);
      wrapper.append(this.createAllDayEvents(allDayEvents));
      wrapper.append(this.createTimedEvents(timedEvents));
    }
    return wrapper;
  },
  createTimedEvents(events) {
    if (events.length < 1) {
      return "";
    }
    const wrapper = document.createElement("div");
    wrapper.append(divider("Upcoming"));
    wrapper.classList.add("timed");
    for (const event of events.slice(0, 4)) {
      const start = new Date(event.start.dateTime);
      const eventWrapper = document.createElement("div");
      eventWrapper.classList.add("event");
      if (isCurrentEvent(event)) {
        setTimeout(() => {
          eventWrapper.classList.add("current");
        }, 500);
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
    wrapper.append(divider("All Day"));
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
    console.log(this.refreshTimeout, "event");
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
    return this.events ? "Today's Agenda" : null;
  },
  suspend() {
    console.log("suspend");
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
  },
  resume() {
    console.log("resume");
    this.getEvents();
  },
  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case "RECIEVE_EVENTS":
        this.events = payload ?? [];
        this.events.length > 0
          ? this.hidden && this.show(1000)
          : !this.hidden && this.hide(1000);
        let timeout;
        let firstTimedEvent = this.events.find((event) => event.start.dateTime);
        if (firstTimedEvent) {
          if (isCurrentEvent(firstTimedEvent)) {
            const end = new Date(firstTimedEvent.end.dateTime);
            timeout = end - Date.now();
          } else {
            const start = new Date(firstTimedEvent.start.dateTime);
            timeout = start - Date.now();
          }
        } else {
          let endDay = new Date();
          endDay.setHours(24, 0, 0, 0);
          timeout = endDay - Date.now();
        }
        this.refreshTimeout = setTimeout(() => {
          this.getEvents();
        }, timeout);
        this.updateDom(500);
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
