import { state } from "../state.js";
import FavoriteButton from "./FavoriteButton.js";
import { Contact } from "../utils/index.js";

function ContactDetailItem(props: Contact) {
  const name = document.createElement("p");
  name.textContent = `${props.firstName} ${props.lastName}`;

  const gender = document.createElement("p");
  gender.textContent = props.gender;

  const age = document.createElement("p");
  age.textContent = `${props.age} years old`;

  const phoneNumber = document.createElement("p");
  phoneNumber.textContent = props.phone;

  const email = document.createElement("p");
  email.textContent = props.email;

  const favoriteButton = FavoriteButton(props);

  const div = document.createElement("div");

  div.append(name);
  div.append(gender);
  div.append(age);
  div.append(phoneNumber);
  div.append(email);
  div.append(favoriteButton);

  return div;
}

export default function ContactDetail() {
  const loadingText = document.createElement("p");
  loadingText.textContent = "Loading Contacts...";

  const emptyText = document.createElement("p");
  emptyText.textContent = "Contact Empty";

  const errorText = document.createElement("p");
  errorText.textContent = state.detailPage.errorMessage;

  const div = document.createElement("div");

  if (state.detailPage.loading) {
    div.append(loadingText);
  } else if (state.detailPage.errorMessage !== "") {
    div.append(errorText);
  } else if (state.detailPage.contact === null) {
    div.append(emptyText);
  } else {
    div.append(ContactDetailItem(state.detailPage.contact));
  }

  return div;
}
