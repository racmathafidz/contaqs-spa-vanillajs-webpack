import App from "./App.js";
import { getAllUsers, getUsers, getDetailUser } from "./utils/index.js";

export let state = {
    path: window.location.pathname,
    inputValue: localStorage.getItem("inputValue") ?? "",
    loadingDetailUsers: false,
    loadingUsers: false,
    contacts: [],
    favoriteContacts: [],
    detailContact: null,
    contactId: new URL(window.location.href).searchParams.get('id'),
    errorMessage: "",
    totalOfPages: 0,
    pageSkip: 0,
};

export let nullState = {
    path: null,
    inputValue: null,
    loadingDetailUsers: null,
    loadingUsers: null,
    contacts: null,
    favoriteContacts: null,
    detailContact: null,
    errorMessage: null,
    totalOfPages: 0,
    pageSkip: null,
};

let timeout;

export function setState(newState) {
    const prevState = { ...state };
    const nextState = { ...state, ...newState };
    state = nextState;
    onStateChange(prevState, nextState)
    Render();
}

export function onStateChange(prevState, nextState) {
    if (prevState.path != nextState.path) {
        const url = new URL(window.location.href);
        url.search = "";
        url.path = nextState.path;
        history.pushState(null, "", url.toString());
    }
    if (prevState.inputValue !== nextState.inputValue) {
        setState({ pageSkip: 0 });
        getAllUsers()
            .then((data) => {
                setState({ loadingUsers: false, totalOfPages: Math.ceil(data.users.length / 5), errorMessage: "" });
            })
            .catch((err) =>
                setState({ loadingUsers: false, totalOfPages: 0, errorMessage: err.message })
            );
    }
    if (prevState.contactId !== nextState.contactId) {
        const url = new URL(window.location.href);
        if (nextState.contactId === null) {
            url.searchParams.delete('id');
        } else {
            url.searchParams.set('id', nextState.contactId);
            setState({ loadingDetailUsers: true });
            getDetailUser(nextState.contactId)
                .then((data) => {
                    setState({ loadingDetailUsers: false, detailContact: data, errorMessage: "" });
                })
                .catch((err) =>
                    setState({ loadingDetailUsers: false, detailContact: null, errorMessage: err.message })
                );
        }
        history.pushState({}, null, url.toString());
    }
    if ((prevState.inputValue !== nextState.inputValue) || (prevState.pageSkip !== nextState.pageSkip)) {
        localStorage.setItem('inputValue', nextState.inputValue);
        setState({ loadingUsers: true });

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            getUsers({ query: nextState.inputValue, limit: 5, skip: nextState.pageSkip })
                .then((data) => {
                    setState({ loadingUsers: false, contacts: data.users, errorMessage: "" });
                })
                .catch((err) =>
                    setState({ loadingUsers: false, contacts: [], errorMessage: err.message })
                );
        }, 600);
    }
}

export function Render() {
    const root = document.getElementById('root');
    const app = App();

    const focusedElementId = document.activeElement.id;
    const focusedElementSelectionStart = document.activeElement.selectionStart;
    const focusedElementSelectionEnd = document.activeElement.selectionEnd;

    root.innerHTML = ""; // Membersihkan halaman
    root.appendChild(app);

    if (focusedElementId) {
        const focusedElement = document.getElementById(focusedElementId);
        focusedElement.focus();
        focusedElement.selectionStart = focusedElementSelectionStart;
        focusedElement.selectionEnd = focusedElementSelectionEnd;
    }
}