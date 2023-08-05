import { state, dispatch } from "../state";
import { Contact } from "../utils/index";
import Link from "./Link";
import Separator from "./Separator";
import FavoriteButton from "./FavoriteButton";

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

type ContactListProps = {
  contacts: Contact[];
};

export default function ContactList(props: ContactListProps) {
  let items = props.contacts.map((contact) =>
    ContactItem({
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
    })
  );

  const div = document.createElement("div");

  div.append(...items);

  return div;
}
