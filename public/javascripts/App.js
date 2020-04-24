function PhoneBookService() {
    this.getContacts = function (term) {
        return $.get('/getContacts?term=' + term);
    }

    this.addContact = function (contact) {
        return $.post({
            url: '/addContact',
            contentType: 'application/json',
            data: JSON.stringify({request: contact})
        });
    }

    this.deleteContact = function (term) {
        return $.get
    }
}

new Vue({
    el: '#app',
    data: {
        service: new PhoneBookService(),
        term: '',
        contacts: [],
        firstName: '',
        lastName: '',
        phone: '',
        isEmptyFirstName: false,
        isEmptyLastName: false,
        isEmptyPhone: false
    },
    created: function () {
        this.getContacts();
    },
    methods: {
        getContacts: function () {
            var that = this;

            this.service.getContacts(this.term).done(function (contacts) {
                that.contacts = contacts;
            });
        },
        add: function () {
            var that = this;

            this.service.addContact({id: null, firstName: this.firstName, lastName: this.lastName, phone: this.phone});

            this.getContacts();
        }
    },
    computed: {

    }
});