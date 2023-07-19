import { state, setState } from "../state.js";
import Link from "./Link.js";
import Space from "./Space.js";

export default function Pagination() {
    let items = [...Array(state.totalOfPages)].map((e, i) =>
        Link({
            href: `/home`,
            label: `${i + 1}`,
            onClick: () => {
                setState({ pageSkip: 5 * i });
            },
        })
    );

    const space = Space();

    const div = document.createElement('div');
    div.append(space);
    if (state.inputValue === "") {
        div.append(...items);
    }

    return div;
}