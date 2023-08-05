import { state } from "../state";
import Link from "../components/Link";
import Space from "../components/Space";
import ContactList from "../components/ContactList";

export default function FavoriteScreen() {
  const linkHome = Link({
    href: "/home",
    label: "Kembali ke Home",
  });

  const div = document.createElement("div");
  div.append(linkHome);
  div.append(Space());
  div.append(ContactList({ contacts: state.favoritePage.contacts }));

  return div;
}
