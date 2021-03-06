const express = require("express");
const router = new express.Router();
const Restaurant = require("../models/restaurant");
const auth = require("../middleware/auth");

router.post("/restaurants", [auth], async (req, res) => {
    const restaurant = new Restaurant({ manager: req.user.id, ...req.body });
    restaurant
        .save()
        .then(() => {
            res.status(201).send(restaurant);
        })
        .catch((e) => {
            res.status(400).send(e);
        });
});

router.get('/restaurants/mine', [auth], async (req, res) => {
    const restaurant = await Restaurant.findByOwner(req.user);
    if (restaurant && restaurant._id) {
        res.send(restaurant);
    }
    else { res.send(null); }
})

router.get("/restaurants/:id", async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const restaurant = await Restaurant.findById(id);
        res.send(restaurant);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;