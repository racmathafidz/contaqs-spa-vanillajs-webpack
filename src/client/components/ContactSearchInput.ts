import { state, setState } from "../state.js";
import Space from "./Space.js";

export default function ContactSearchInput() {
  const input = document.createElement("input");
  input.id = "input";
  input.value = state.inputValue;
  input.placeholder = "Enter contact name";
  input.oninput = function (event) {
    setState({ inputValue: (event.target as HTMLInputElement).value });
  };

  const buttonClear = document.createElement("button");
  buttonClear.textContent = "X";
  buttonClear.onclick = function () {
    setState({ inputValue: "" });
  };

  const space = Space();

  const div = document.createElement("div");
  div.append(input);
  div.append(buttonClear);
  div.append(space);

  return div;
}
