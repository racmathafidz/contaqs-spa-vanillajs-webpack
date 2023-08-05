import Link from "./Link";
import Separator from "./Separator";
import Space from "./Space";

export default function Navbar() {
  const linkHome = Link({
    href: "/home",
    label: "Home",
  });

  const linkFavorite = Link({
    href: "/favorite",
    label: "Favorite",
  });

  const separator = Separator();

  const space = Space();

  const div = document.createElement("div");
  div.append(linkHome);
  div.append(separator);
  div.append(linkFavorite);
  div.append(space);

  return div;
}
