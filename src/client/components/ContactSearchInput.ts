import { state, setState, dispatch } from "../state.js";
import Space from "./Space.js";

export default function ContactSearchInput() {
  const input = document.createElement("input");
  input.id = "input";
  input.value = state.homePage.inputValue;
  input.placeholder = "Enter contact name";
  input.oninput = function (event) {
    dispatch({
      type: "CHANGE_INPUT",
      payload: (event.target as HTMLInputElement).value,
    });
  };

  const buttonClear = document.createElement("button");
  buttonClear.textContent = "X";
  buttonClear.onclick = function () {
    dispatch({ type: "CLEAR_INPUT" });
  };

  const space = Space();

  const div = document.createElement("div");
  div.append(input);
  div.append(buttonClear);
  div.append(space);

  return div;
}
