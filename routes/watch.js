const express = require("express");
const { stream } = require("../modules/Watch");
const router = express.Router();


router.get("/:id", async function(req, res, next) {
  const item = await stream(req);
  res.render("watch/index", { layout: "watch/layout.hbs", title: "Movies", item });

});

module.exports = router;