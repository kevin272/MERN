const router = require('express').Router();


router.route('/')
    .get((req, res, next) => {
        res.json({
            message: 'Banner List'
        });
    })
    .post((req, res, next) => {
        res.json({
            message: 'Banner Created'
        });
    });

module.exports = router;