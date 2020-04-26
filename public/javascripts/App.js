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
        //todo send array with ids to remove
    this.removeContact = function (contact) {
        return $.post({
            url: '/removeContact',
            contentType: 'application/json',
            data: JSON.stringify({request: contact})
        });
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
        isEmptyPhone: false,
        checkedContactsIDs: [],
        currentContact: {},
        modalText: ''
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
            if (this.hasEmptyFields()) {
                return;
            }

            this.service.addContact({firstName: this.firstName, lastName: this.lastName, phone: this.phone});

            this.clearInputs();

            this.getContacts();
        },
        remove: function () {
            var id = this.currentContact.id;

            this.checkedContactsIDs = this.checkedContactsIDs.filter(function (contactId) {
                return contactId !== id;
            });

            this.service.removeContact({id: id});

            this.currentContact = {};

            this.getContacts();
        },
        clearInputs: function () {
            this.firstName = '';
            this.lastName = '';
            this.phone = '';
        },
        hasEmptyFields: function () {
            if (this.firstName.trim() === '') {
                this.isEmptyFirstName = true;
            }

            if (this.lastName.trim() === '') {
                this.isEmptyLastName = true;
            }

            if (this.phone.trim() === '') {
                this.isEmptyPhone = true;
            }

            return this.isEmptyFirstName || this.isEmptyLastName || this.isEmptyPhone;
        },
        openConfirmationModal: function (contact) {
            if (contact) {
                this.currentContact = contact;

                this.modalText = 'Remove contact: '
                    + contact.firstName + ' '
                    + contact.lastName  + ' '
                    + contact.phone + '?'
            } else {
                this.modalText = 'Remove all selected contacts?'
            }

            this.$bvModal.show('confirmation-modal');
        }
    },
    computed: {
        hasNoFilledFields: function () {
            return this.firstName === '' && this.lastName === '' && this.phone === '';
        },
        isEmptyTerm: function () {
            return this.term.trim() === '';
        },
        hasEmptyContacts: function () {
            return this.contacts.length === 0;
        },
        selectAll: {
            get: function () {
                return this.contacts ? this.checkedContactsIDs.length === this.contacts.length : false;
            },
            set: function (value) {
                var checked = [];

                if (value) {
                    this.contacts.forEach(function (contact) {
                        checked.push(contact.id);
                    });
                }

                this.checkedContactsIDs = checked;
            }
        },
        hasNoCheckedContacts: function () {
            return this.checkedContactsIDs.length === 0;
        }
    }
});