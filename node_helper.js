const NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
  start: function () {
    this.expressApp.get("/foobar", function (req, res) {
      res.send("GET request to /foobar");
    });
  },
});
