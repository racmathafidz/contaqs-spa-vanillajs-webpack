import { state, setState } from "../state.js";

export default function FavoriteButton(props) {
    const isFavorite = state.favoriteContacts.some(fav => fav.id === props.id);

    const button = document.createElement('button');
    button.textContent = isFavorite ? 'Remove from favorite' : 'Add to favorite';
    button.onclick = function () {
        if (isFavorite) {
            setState({ favoriteContacts: state.favoriteContacts.filter((e, i) => e.id !== props.id) });
        } else {
            setState({ favoriteContacts: [...state.favoriteContacts, props] });
        }
    }

    return button;
}