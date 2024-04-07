const express = require("express");
const router = express.Router();
const { index, create, remove, detail, update } = require("../modules/Movies");
let multer = require("multer");
let upload = multer();

router.get("/", async function(req, res, next) {
  const items = await index(req);
  res.render("movies/index", { title: "Movies", items });
});

router.get("/create", function(req, res, next) {
  res.render("movies/form", { title: "Movies Create", action: "create" });
});

router.post("/create", upload.array("subtitle"), async function(req, res, next) {
  await create(req).then(result => {
    res.redirect("/movies/edit/" + result.id);
  });
});

router.get("/edit/:id", async function(req, res, next) {
  const item = await detail(req);
  res.render("movies/form", { title: "Movies Edit", action: "edit/" + item.id, item });
});

router.post("/edit/:id", upload.array("subtitle"), async function(req, res, next) {
  await update(req).then(result => {
    // res.redirect("/movies/");
    res.redirect("/movies/edit/" + req.params.id);
  });
});

router.get("/remove/:id", async function(req, res, next) {
  const items = await remove(req);
  res.redirect("/movies");
});

// router.get("/watch/:id", async function(req, res, next) {
//   const item = await detail(req);
//   res.render("movies/watch", { title: "Movies Watch", action: "edit/" + item.id, item });
// });

module.exports = router;