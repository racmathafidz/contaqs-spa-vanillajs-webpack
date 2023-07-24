import { state, dispatch } from "../state.js";
import { Contact } from "../utils/index.js";
import Link from "./Link.js";
import Separator from "./Separator.js";
import FavoriteButton from "./FavoriteButton.js";

function ContactItem(props: any) {
  const name = Link({
    href: `/contact-detail`,
    label: `${props.firstName} ${props.lastName}`,
    onClick: () => {
      dispatch({ type: "SET_CONTACT_ID", payload: props.id });
    },
  });

  const phoneNumber = document.createElement("span");
  phoneNumber.textContent = props.phone;

  const separator1 = Separator();

  const separator2 = Separator();

  const favoriteButton = FavoriteButton(props);

  const div = document.createElement("div");

  div.append(name);
  div.append(separator1);
  div.append(phoneNumber);
  div.append(separator2);
  div.append(favoriteButton);

  return div;
}

export default function ContactList(props: Contact[]) {
  console.log(props);
  let items = props.map((contact: Contact) =>
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
  errorText.textContent = state.homePage.errorMessage;

  const div = document.createElement("div");

  if (state.homePage.loading) {
    div.append(loadingText);
  } else if (state.homePage.errorMessage !== "") {
    div.append(errorText);
  } else if (state.homePage.contacts.length == 0) {
    div.append(emptyText);
  } else {
    div.append(...items);
  }

  return div;
}
