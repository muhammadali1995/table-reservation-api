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

router.get("/tables", [auth], async (req, res) => {
  const myRestaurant = await Restaurant.findByOwner(req.user);
  if (!myRestaurant) return res.status(500).send('Please create restaurant first');

  try {
    const tables = await Table.find({ restaurant: myRestaurant }).sort({ 'referenceNumber': 'asc' });
    res.send(tables);
  } catch (error) {
    res.status(404).send(error);
  }
});

router.get("/tables/:id", [auth], async (req, res) => {
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


router.put('/tables/swap', [auth], async (req, res) => {
  const { sourceTableRN, tagetTableRN } = req.body;
  const resp = [];
    
  try {
    const myRestaurant = await Restaurant.findByOwner(req.user);
    if (!myRestaurant) return res.status(500).send('Please create restaurant first');

    const sourceTable = await Table.findOne({ restaurant: myRestaurant, referenceNumber: sourceTableRN });
    if (!sourceTable) {
      throw new Error('Table does not exist with the given reference number');
    }

    sourceTable.referenceNumber = tagetTableRN;

    const targetTable = await Table.findOne({ restaurant: myRestaurant, referenceNumber: tagetTableRN });
    if (targetTable) {
      targetTable.referenceNumber = sourceTableRN;
      await targetTable.save();
      resp.push(targetTable);
    }
    
    await sourceTable.save();
    resp.push(sourceTable);
    
    res.send(resp);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
})

router.put('/tables/:id', [auth], async (req, res) => {
  const id = req.params.id;
  let payload = req.body;
  try {
    var table = await Table.findById(id);
  } catch (error) {
    res.status(404).send('Table not found');
  }

  table.referenceNumber = payload.referenceNumber;
  table.seats = payload.seats;
  try {
    await Table.findOneAndUpdate({ _id: table._id }, table);
    res.send(table);
  } catch (error) {
    res.status(500).send(error);
  }
})


router.delete('/tables/:id', [auth], async (req, res) => {
  const id = req.params.id;
  try {
    let resp = await Table.findByIdAndRemove(id);
    res.send(resp);
  } catch (error) {
    res.status(500).send(error);
  }
})


module.exports = router;