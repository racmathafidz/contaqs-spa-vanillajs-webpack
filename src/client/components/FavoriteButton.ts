import { state, dispatch } from "../state.js";
import { Contact } from "../utils/index.js";

export default function FavoriteButton(props: Contact) {
  const isFavorite = state.favoritePage.contacts.some(
    (fav) => fav.id === props.id
  );

  const button = document.createElement("button");
  button.textContent = isFavorite ? "Remove from favorite" : "Add to favorite";
  button.onclick = function () {
    if (isFavorite) {
      dispatch({
        type: "REMOVE_FAVORITE_STATUS",
        payload: props.id,
      });
    } else {
      dispatch({
        type: "ADD_FAVORITE_STATUS",
        payload: props,
      });
    }
  };

  return button;
}
