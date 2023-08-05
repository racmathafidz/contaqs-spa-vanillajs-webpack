import { state, setState, dispatch } from "../state";
import Link from "./Link";
import Space from "./Space";

export default function Pagination() {
  let items = [...Array(state.homePage.totalOfPages)].map((e, i) =>
    Link({
      href: `/home`,
      label: `${i + 1}`,
      onClick: () => {
        dispatch({ type: "SET_PAGINATION", payload: 5 * i });
      },
    })
  );

  const space = Space();

  const div = document.createElement("div");
  div.append(space);
  if (state.homePage.inputValue === "") {
    div.append(...items);
  }

  return div;
}
