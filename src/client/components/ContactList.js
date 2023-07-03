import { setState, state } from '../state.js';
import Link from './Link.js';
import Separator from './Separator.js';
import FavoriteButton from './FavoriteButton.js';

function ContactItem(props) {
    const name = Link({
        href: `/contact-detail`,
        label: `${props.firstName} ${props.lastName}`,
        onClick: () => {
            setState({ contactId: props.id });
        },
    })

    const phoneNumber = document.createElement('span');
    phoneNumber.textContent = props.phone;

    const separator1 = Separator();

    const separator2 = Separator();

    const favoriteButton = FavoriteButton(props);

    const div = document.createElement('div');

    div.append(name);
    div.append(separator1);
    div.append(phoneNumber);
    div.append(separator2);
    div.append(favoriteButton);

    return div;
}

export default function ContactList(props) {
    let items = props.map((contact) =>
        ContactItem({
            id: contact.id,
            firstName: contact.firstName,
            lastName: contact.lastName,
            phone: contact.phone,
        })
    );

    const loadingText = document.createElement("p");
    loadingText.textContent = "Loading Contacts...";

    const emptyText = document.createElement("p");
    emptyText.textContent = "Contact Empty";

    const errorText = document.createElement("p");
    errorText.textContent = state.errorMessage;

    const div = document.createElement("div");

    if (state.loadingUsers) {
        div.append(loadingText);
    } else if (state.errorMessage !== "") {
        div.append(errorText);
    } else if (state.contacts.length == 0) {
        div.append(emptyText);
    } else {
        div.append(...items);
    }

    return div;
}