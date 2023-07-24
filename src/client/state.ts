import App from "./App.js";
import { Contact, getContacts, getDetailContact } from "./utils/index.js";

type State = {
  path: string;
  contactId: Contact["id"] | null;
  homePage: {
    inputValue: string;
    loading: boolean;
    contacts: Contact[];
    totalOfPages: number;
    pageSkip: number;
    errorMessage: string;
  };
  detailPage: {
    loading: boolean;
    contact: Contact | null;
    errorMessage: string;
  };
  favoritePage: {
    contacts: Contact[];
    errorMessage: string;
  };
};

type Action =
  | { type: "FETCH_ALL_CONTACTS" }
  | {
      type: "FETCH_ALL_CONTACTS_SUCCESS";
      payload: {
        users: Contact[];
        total: number;
      };
    }
  | {
      type: "FETCH_ALL_CONTACTS_ERROR";
      payload: {
        message: string;
      };
    }
  | { type: "FETCH_DETAIL_CONTACT" }
  | {
      type: "FETCH_DETAIL_CONTACT_SUCCESS";
      payload: Contact | null;
    }
  | {
      type: "FETCH_DETAIL_CONTACT_ERROR";
      payload: {
        message: string;
      };
    }
  | {
      type: "CHANGE_INPUT";
      payload: string;
    }
  | { type: "CLEAR_INPUT" }
  | {
      type: "CHANGE_PAGE";
      payload: string;
    }
  | {
      type: "SET_PAGINATION";
      payload: number;
    }
  | {
      type: "SET_CONTACT_ID";
      payload: Contact["id"] | null;
    }
  | {
      type: "ADD_FAVORITE_STATUS";
      payload: Contact;
    }
  | {
      type: "REMOVE_FAVORITE_STATUS";
      payload: Contact["id"];
    };

const contactIdParam = new URL(window.location.href).searchParams.get("id");

export let state: State = {
  path: window.location.pathname,
  contactId: contactIdParam ? parseInt(contactIdParam) : null,
  homePage: {
    inputValue: localStorage.getItem("inputValue") ?? "",
    loading: false,
    contacts: [],
    totalOfPages: 0,
    pageSkip: 0,
    errorMessage: "",
  },
  detailPage: {
    loading: false,
    contact: null,
    errorMessage: "",
  },
  favoritePage: {
    contacts: [],
    errorMessage: "",
  },
};

let timeout: NodeJS.Timeout;

export function setState(newState: Partial<State>) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };
  state = nextState;
  onStateChange(prevState, nextState);
  Render();
}

function reducer(prevState: State, action: Action): State {
  switch (action.type) {
    case "FETCH_ALL_CONTACTS": {
      return {
        ...prevState,
        homePage: {
          ...prevState.homePage,
          loading: true,
        },
      };
    }
    case "FETCH_ALL_CONTACTS_SUCCESS": {
      return {
        ...prevState,
        homePage: {
          ...prevState.homePage,
          loading: false,
          contacts: action.payload.users,
          totalOfPages: Math.ceil(action.payload.total / 5),
          errorMessage: "",
        },
      };
    }
    case "FETCH_ALL_CONTACTS_ERROR": {
      return {
        ...prevState,
        homePage: {
          ...prevState.homePage,
          loading: false,
          contacts: [],
          errorMessage: action.payload.message,
        },
      };
    }
    case "FETCH_DETAIL_CONTACT": {
      return {
        ...prevState,
        detailPage: {
          ...prevState.detailPage,
          loading: true,
        },
      };
    }
    case "FETCH_DETAIL_CONTACT_SUCCESS": {
      return {
        ...prevState,
        detailPage: {
          ...prevState.detailPage,
          loading: false,
          contact: action.payload,
          errorMessage: "",
        },
      };
    }
    case "FETCH_DETAIL_CONTACT_ERROR": {
      return {
        ...prevState,
        detailPage: {
          ...prevState.detailPage,
          loading: false,
          contact: null,
          errorMessage: action.payload.message,
        },
      };
    }
    case "CHANGE_INPUT": {
      return {
        ...prevState,
        homePage: {
          ...prevState.homePage,
          inputValue: action.payload,
        },
      };
    }
    case "CLEAR_INPUT": {
      return {
        ...prevState,
        homePage: {
          ...prevState.homePage,
          inputValue: "",
        },
      };
    }
    case "CHANGE_PAGE": {
      return { ...prevState, path: action.payload };
    }
    case "SET_PAGINATION": {
      return {
        ...prevState,
        homePage: {
          ...prevState.homePage,
          pageSkip: action.payload,
        },
      };
    }
    case "SET_CONTACT_ID": {
      return { ...prevState, contactId: action.payload };
    }
    case "ADD_FAVORITE_STATUS": {
      return {
        ...prevState,
        favoritePage: {
          ...prevState.favoritePage,
          contacts: [...state.favoritePage.contacts, action.payload],
        },
      };
    }
    case "REMOVE_FAVORITE_STATUS": {
      return {
        ...prevState,
        favoritePage: {
          ...prevState.favoritePage,
          contacts: state.favoritePage.contacts.filter(
            (e, i) => e.id !== action.payload
          ),
        },
      };
    }
    default: {
      return prevState;
    }
  }
}

export function dispatch(action: Action) {
  const newState = reducer(state, action);
  setState(newState);
}

export function onStateChange(prevState: Partial<State>, nextState: State) {
  if (prevState.path != nextState.path) {
    const url = new URL(window.location.href);
    url.search = "";
    url.pathname = nextState.path;
    history.pushState(null, "", url.toString());
  }
  // if (prevState.inputValue !== nextState.inputValue) {
  //   setState({ pageSkip: 0 });
  //   getContacts()
  //     .then((data) => {
  //       setState({
  //         loadingContacts: false,
  //         totalOfPages: Math.ceil(data.total / 5),
  //         errorMessage: "",
  //       });
  //     })
  //     .catch((err: any) =>
  //       setState({
  //         loadingContacts: false,
  //         totalOfPages: 0,
  //         errorMessage: err.message,
  //       })
  //     );
  // }
  if (prevState.contactId !== nextState.contactId) {
    const url = new URL(window.location.href);
    if (nextState.contactId === null) {
      url.searchParams.delete("id");
    } else {
      url.searchParams.set("id", nextState.contactId.toString());
      dispatch({ type: "FETCH_DETAIL_CONTACT" });
      // setState({ loadingDetailContact: true });
      getDetailContact(nextState.contactId)
        .then((data) => {
          dispatch({ type: "FETCH_DETAIL_CONTACT_SUCCESS", payload: data });
          // setState({
          //   loadingDetailContact: false,
          //   detailContact: data,
          //   errorMessage: "",
          // });
        })
        .catch((err) => {
          dispatch({ type: "FETCH_DETAIL_CONTACT_ERROR", payload: err });
          // setState({
          //   loadingDetailContact: false,
          //   detailContact: null,
          //   errorMessage: err.message,
          // })
        });
    }
    history.pushState({}, "", url.toString());
  }
  if (
    prevState.homePage?.inputValue !== nextState.homePage.inputValue ||
    prevState.homePage?.pageSkip !== nextState.homePage.pageSkip
  ) {
    localStorage.setItem("inputValue", nextState.homePage.inputValue);
    dispatch({ type: "FETCH_ALL_CONTACTS" });
    // setState({ loadingContacts: true });

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      getContacts({
        query: nextState.homePage.inputValue,
        limit: 5,
        skip: nextState.homePage.pageSkip,
      })
        .then((data) => {
          dispatch({ type: "FETCH_ALL_CONTACTS_SUCCESS", payload: data });
          // setState({
          //   loadingContacts: false,
          //   contacts: data.contacts,
          //   totalOfPages: Math.ceil(data.total / 5),
          //   errorMessage: "",
          // });
        })
        .catch((err) => {
          dispatch({ type: "FETCH_ALL_CONTACTS_ERROR", payload: err });
          // setState({
          //   loadingContacts: false,
          //   contacts: [],
          //   errorMessage: err.message,
          // })
        });
    }, 600);
  }
}

export function Render() {
  const root = document.getElementById("root");
  const app = App();

  let focusedElementId = null;
  let focusedElementSelectionStart = null;
  let focusedElementSelectionEnd = null;

  if (
    document.activeElement !== null &&
    document.activeElement instanceof HTMLInputElement
  ) {
    focusedElementId = document.activeElement.id;
    focusedElementSelectionStart = document.activeElement.selectionStart;
    focusedElementSelectionEnd = document.activeElement.selectionEnd;
  }

  if (root !== null) {
    root.innerHTML = ""; // Membersihkan halaman
    root.appendChild(app);
  }

  if (focusedElementId !== null) {
    const focusedElement = document.getElementById(focusedElementId);

    if (focusedElement instanceof HTMLInputElement) {
      focusedElement.focus();
      focusedElement.selectionStart = focusedElementSelectionStart;
      focusedElement.selectionEnd = focusedElementSelectionEnd;
    }
  }
}
