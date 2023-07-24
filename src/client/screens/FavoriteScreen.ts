import { state } from "../state.js";
import Link from "../components/Link.js";
import Space from "../components/Space.js";
import ContactList from "../components/ContactList.js";

export default function FavoriteScreen() {
  const linkHome = Link({
    href: "/home",
    label: "Kembali ke Home",
  });

  const div = document.createElement("div");
  div.append(linkHome);
  div.append(Space());
  div.append(ContactList(state.favoritePage.contacts));

  return div;
}
