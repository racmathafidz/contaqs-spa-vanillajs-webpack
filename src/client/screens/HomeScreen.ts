import { state } from "../state.js";
import Navbar from "../components/Navbar.js";
import ContactSearchInput from "../components/ContactSearchInput.js";
import ContactList from "../components/ContactList.js";
import Pagination from "../components/Pagination.js";

export default function HomeScreen() {
  const div = document.createElement("div");
  div.append(Navbar());
  div.append(ContactSearchInput());
  div.append(ContactList(state.homePage.contacts));
  div.append(Pagination());

  return div;
}
