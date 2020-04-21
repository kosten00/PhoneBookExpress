var express = require('express');
var router = express.Router();

var contacts = [];
var newId = 1;

router.get('/getContacts', function (req, res) {
    var term = (req.query.term || '').toUpperCase();

    var filteredContacts = term.length === 0
        ? contacts
        : contacts.filter(function (c) {
            return c.name.toUpperCase().indexOf(term) >= 0
                || c.phone.toUpperCase().indexOf(term) >= 0;
        });

    res.send(filteredContacts);
})

router.post('/deleteContact', function (req, res) {
    var id = req.body.id;

    var contact = contacts.find(function (c) {
        return c.id === id;

    })

    if (contact === undefined) {
        res.send({
            success: false,
            message: 'Contact with id = ' + id + ' not found'
        });

        return;
    }

    contacts = contacts.filter(function (c) {
        return c.id !== id;
    });

    res.send({
        success: true,
        message: null
    });

});

router.post('/addContact', function (req, res) {
    var contact = req.body.request;

    var hasContactWithPhone = contacts.some(function (c) {
        return c.phone.toUpperCase() === contact.phone.toUpperCase();
    });

    if (hasContactWithPhone) {
        res.send({
            success: false,
            message: 'Contact with this phone already exists!'
        });

        return;
    }

    contact.id = newId;
    newId++;

    contacts.push(contact);

    res.send({
            success: true,
            message: null
        }
    );
});

/* GET home page. */
router.get('/', function (req, res, next) {


    res.render('index', {title: 'Express'});
});

module.exports = router;
