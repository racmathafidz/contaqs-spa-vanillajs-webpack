import { setState, dispatch } from "../state.js";

export default function Link(props: any) {
  const link = document.createElement("a");
  link.href = props.href;
  link.textContent = props.label;
  link.onclick = (event) => {
    event.preventDefault();
    const url = new URL((event.target as HTMLAnchorElement).href);
    dispatch({ type: "CHANGE_PAGE", payload: url.pathname });
    if (props.onClick) props.onClick();
  };

  return link;
}
