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

    this.removeContacts = function (IDs) {
        return $.post({
            url: '/removeContacts',
            contentType: 'application/json',
            data: JSON.stringify({request: IDs})
        });
    }
}

new Vue({
    el: '#app',
    data: {
        service: new PhoneBookService(),
        contacts: [],
        firstName: '',
        lastName: '',
        phone: '',
        isEmptyFirstName: false,
        isEmptyLastName: false,
        isEmptyPhone: false,
        term: '',
        checkedContactsIDs: [],
        currentContact: {},
        modalText: '',
        hasSearchFilterApplied: false,
        searchButtonText: 'Search'
    },
    created: function () {
        this.getContacts();
    },
    methods: {
        getContacts: function () {
            if (this.hasSearchFilterApplied) {
                this.hasSearchFilterApplied = false;

                this.searchButtonText = 'Search';

                this.term = '';
            }

            if (this.term.length > 0  && !this.hasSearchFilterApplied) {
                this.hasSearchFilterApplied = true;

                this.searchButtonText = 'Disable search filter';
            }

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
            var IDs = [];

            if (this.checkedContactsIDs.length > 0) {
                IDs = this.checkedContactsIDs;
            } else {
                IDs.push(this.currentContact.id);

                this.currentContact = {};
            }

            for (var i = 0; i < IDs.length; i++) {
                this.checkedContactsIDs = this.checkedContactsIDs.filter(function (contactId) {
                    return contactId !== IDs[i];
                });
            }

            this.service.removeContacts({IDs: IDs});

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
            if (contact !== undefined) {
                this.currentContact = contact;

                this.modalText = 'Remove contact: '
                    + contact.firstName + ' '
                    + contact.lastName + ' '
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
                if (this.contacts !== undefined) {
                    return this.checkedContactsIDs.length === this.contacts.length;
                } else {
                    return false;
                }
            },
            set: function (value) {
                var checked = [];

                if (value !== undefined) {
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