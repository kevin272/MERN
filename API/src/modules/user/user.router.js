const express = require('express');
const router = express.Router();

const loginCheck = (req, res, next) => {
    // Middleware logic
    next();
};

// Define routes
router.route('/')
    .post((req, res) => {
        res.json({
            result: null,
            message: "User created",
            meta: null
        });
    })
    .get((req, res) => {
        res.json({
            result: null,
            message: "List all users",
            meta: null
        });
    });

// Define routes with parameters
router.route('/:id')
    .get((req, res) => {
        res.json({
            result: null,
            message: `User Detail of ${req.params.id}`,
            meta: null
        });
    })
    .put((req, res) => {
        res.json({
            result: null,
            message: `User Update of ${req.params.id}`,
            meta: null
        });
    })
    .delete((req, res) => {
        res.json({
            result: null,
            message: `User Delete of ${req.params.id}`,
            meta: null
        });
    });

module.exports = router;