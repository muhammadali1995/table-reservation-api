const express = require('express');
const router = new express.Router();
const Restaurant = require("../models/restaurant");
const Table = require('../models/table');
const Reservation = require("../models/reservation");
const auth = require("../middleware/auth");

router.get('/reservations', [auth], async (req, res) => {
    const user = req.user;

    try {
        //find owners restaurant
        var restaurant = await Restaurant.findByOwner(user);
        //find reservations for the restaurant;
        var reservations = await Reservation.findByRestaurant(restaurant);
        res.send(reservations);
    } catch (e) {
        res.send(e);
    }
});

router.post('/reservations', [auth], async (req, res, next) => {
    const reservation = new Reservation(req.body);
    try {
        const existingRes = await Reservation.findOne({ table: reservation.table, start: reservation.start, date: reservation.date });
        if (existingRes) {
            throw new Error('Time is already booked, please choose a new time');
        }
        const rest = await reservation.save();
        res.send(rest);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/reservations/by-table', [auth], async (req, res) => {
    console.log('by table');
    const { table, time } = req.query;
    const filters = { table: table }
    const now = Date.now();

    if (time == 'past') {
        filters.date = { $lt: now };
    } else if (time == 'future') {
        filters.date = { $gte: now };
    }

    try {
        const reservations = await Reservation.find(filters);
        res.send(reservations);
    } catch (e) {
        res.send(e);
    }
});

router.get('/reservations/by-restaurant', [auth], async (req, res) => {
    const user = req.user;
    try {
        //find owners restaurant
        var restaurant = await Restaurant.findByOwner(user);
        var tables = await Table.find({ restaurant: restaurant });
        //find reservations for the restaurant;
        var reservations = await Reservation.find({ table: {$in: tables} }).populate('table', 'referenceNumber');
        reservations = groupBy(reservations, 'table');
        res.send(reservations);
    } catch (e) {
        res.send(e);
    }
})

router.delete('/reservations/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const rs = await Reservation.findOneAndRemove({ _id: id });
        res.send(rs);
    } catch (e) {
        res.send(e);
    }
});


router.put('/reservations/:id', async (req, res) => {
    const { id } = req.params;
    const reqBody = req.body;
    try {
        const updateRes = await Reservation.findOneAndUpdate({ _id: id }, reqBody);
        res.send(updateRes);
    } catch (e) {
        res.send(e);
    }
})

var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};

module.exports = router;