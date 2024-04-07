const express = require("express");
const { stream } = require("../modules/Watch");
const router = express.Router();


router.get("/:id", async function(req, res, next) {
  const items = await stream(req);
  res.render("watch/index", { layout: "watch/layout.hbs", title: "Movies", items });

});

module.exports = router;