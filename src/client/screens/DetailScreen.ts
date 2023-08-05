import { state } from "../state";
import Link from "../components/Link";
import Space from "../components/Space";
import ContactDetail from "../components/ContactDetail";

export default function DetailScreen() {
  const linkHome = Link({
    href: "/home",
    label: "Kembali ke Home",
  });

  const div = document.createElement("div");
  div.append(linkHome);
  div.append(Space());
  div.append(ContactDetail());

  return div;
}
