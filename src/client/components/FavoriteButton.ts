import { state, setState, dispatch } from "../state.js";

export default function FavoriteButton(props: any) {
  const isFavorite = state.favoriteContacts.some((fav) => fav.id === props.id);

  const button = document.createElement("button");
  button.textContent = isFavorite ? "Remove from favorite" : "Add to favorite";
  button.onclick = function () {
    if (isFavorite) {
      dispatch({
        type: "SET_FAVORITE_STATUS",
        payload: state.favoriteContacts.filter((e, i) => e.id !== props.id),
      });
      // setState({
      //   favoriteContacts: state.favoriteContacts.filter(
      //     (e, i) => e.id !== props.id
      //   ),
      // });
    } else {
      dispatch({
        type: "SET_FAVORITE_STATUS",
        payload: [...state.favoriteContacts, props],
      });
      // setState({ favoriteContacts: [...state.favoriteContacts, props] });
    }
  };

  return button;
}
