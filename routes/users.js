const express = require("express");
const router = new express.Router();
const User = require("../models/user");

const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  user
    .save()
    .then(() => {
      user.generateToken().then((token) => {
        res.status(201).send({ user, token });
      });
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (e) {
    res.status(404).send();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
});

module.exports = router;