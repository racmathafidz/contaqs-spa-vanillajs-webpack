import { state } from "../state";
import Navbar from "../components/Navbar";
import ContactSearchInput from "../components/ContactSearchInput";
import ContactList from "../components/ContactList";
import Pagination from "../components/Pagination";

export default function HomeScreen() {
  const div = document.createElement("div");
  div.append(Navbar());
  div.append(ContactSearchInput());

  const loadingText = document.createElement("p");
  loadingText.textContent = "Loading Contacts...";

  const emptyText = document.createElement("p");
  emptyText.textContent = "Contact Empty";

  const errorText = document.createElement("p");
  errorText.textContent = state.homePage.errorMessage;

  if (state.homePage.tag === "loading") {
    div.append(loadingText);
  } else if (state.homePage.errorMessage !== "") {
    div.append(errorText);
  } else if (state.homePage.contacts.length == 0) {
    div.append(emptyText);
  } else {
    div.append(ContactList({ contacts: state.homePage.contacts }));
  }

  div.append(Pagination());

  return div;
}
