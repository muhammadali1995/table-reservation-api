const express = require("express");
const router = new express.Router();
const Table = require("../models/table");
const auth = require("../middleware/auth");
const Restaurant = require("../models/restaurant");

router.post("/tables", [auth], async (req, res) => {
  const table = new Table(req.body);
  const myRestaurant = await Restaurant.findByOwner(req.user);

  if (!myRestaurant) return res.status(500).send('Please create restaurant first');

  table.restaurant = myRestaurant;

  table
    .save()
    .then(() => {
      res.status(201).send(table);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

router.get("/tables/:id", async (req, res) => {
  const {
    id
  } = req.params;
  try {
    const table = await Table.findById(id);
    res.send(table);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;