import App from "./App.js";
import { User, getUsers, getDetailUser } from "./utils/index.js";

type State = {
  path: string;
  inputValue: string;
  loadingDetailUsers: boolean;
  loadingUsers: boolean;
  contacts: User[];
  favoriteContacts: User[];
  detailContact: User | null;
  contactId: User["id"] | null;
  errorMessage: string;
  totalOfPages: number;
  pageSkip: number;
};

type Action = {
  type: string;
  payload?: string | number | boolean | User | User[] | User["id"] | any;
};

const contactIdParam = new URL(window.location.href).searchParams.get("id");

export let state: State = {
  path: window.location.pathname,
  inputValue: localStorage.getItem("inputValue") ?? "",
  loadingDetailUsers: false,
  loadingUsers: false,
  contacts: [],
  favoriteContacts: [],
  detailContact: null,
  contactId: contactIdParam ? parseInt(contactIdParam) : null,
  errorMessage: "",
  totalOfPages: 0,
  pageSkip: 0,
};

let timeout: NodeJS.Timeout;

export function setState(newState: Partial<State>) {
  const prevState = { ...state };
  const nextState = { ...state, ...newState };
  state = nextState;
  onStateChange(prevState, nextState);
  Render();
}

function reducer(prevState: Partial<State>, action: Action) {
  switch (action.type) {
    case "FETCH_ALL_USERS": {
      return { ...prevState, loadingUsers: true };
    }
    case "FETCH_ALL_USERS_SUCCESS": {
      return {
        ...prevState,
        loadingUsers: false,
        contacts: action.payload?.users,
        totalOfPages: Math.ceil(action.payload?.total / 5),
        errorMessage: "",
      };
    }
    case "FETCH_ALL_USERS_ERROR": {
      return {
        ...prevState,
        loadingUsers: false,
        contacts: [],
        errorMessage: action.payload?.message,
      };
    }
    case "FETCH_DETAIL_USER": {
      return { ...prevState, loadingDetailUsers: true };
    }
    case "FETCH_DETAIL_USER_SUCCESS": {
      return {
        ...prevState,
        loadingDetailUsers: false,
        detailContact: action.payload,
        errorMessage: "",
      };
    }
    case "FETCH_DETAIL_USER_ERROR": {
      return {
        ...prevState,
        loadingDetailUsers: false,
        detailContact: null,
        errorMessage: action.payload.message,
      };
    }
    case "CHANGE_INPUT": {
      return { ...prevState, inputValue: action.payload };
    }
    case "CLEAR_INPUT": {
      return { ...prevState, inputValue: "" };
    }
    case "CHANGE_PAGE": {
      return { ...prevState, path: action.payload };
    }
    case "SET_PAGINATION": {
      return { ...prevState, pageSkip: action.payload };
    }
    case "SET_CONTACT_ID": {
      return { ...prevState, contactId: action.payload };
    }
    case "SET_FAVORITE_STATUS": {
      return { ...prevState, favoriteContacts: action.payload };
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
  //   getUsers()
  //     .then((data) => {
  //       setState({
  //         loadingUsers: false,
  //         totalOfPages: Math.ceil(data.total / 5),
  //         errorMessage: "",
  //       });
  //     })
  //     .catch((err: any) =>
  //       setState({
  //         loadingUsers: false,
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
      dispatch({ type: "FETCH_DETAIL_USER" });
      // setState({ loadingDetailUsers: true });
      getDetailUser(nextState.contactId)
        .then((data) => {
          dispatch({ type: "FETCH_DETAIL_USER_SUCCESS", payload: data });
          // setState({
          //   loadingDetailUsers: false,
          //   detailContact: data,
          //   errorMessage: "",
          // });
        })
        .catch((err) => {
          dispatch({ type: "FETCH_DETAIL_USER_ERROR", payload: err });
          // setState({
          //   loadingDetailUsers: false,
          //   detailContact: null,
          //   errorMessage: err.message,
          // })
        });
    }
    history.pushState({}, "", url.toString());
  }
  if (
    prevState.inputValue !== nextState.inputValue ||
    prevState.pageSkip !== nextState.pageSkip
  ) {
    localStorage.setItem("inputValue", nextState.inputValue);
    dispatch({ type: "FETCH_ALL_USERS" });
    // setState({ loadingUsers: true });

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      getUsers({
        query: nextState.inputValue,
        limit: 5,
        skip: nextState.pageSkip,
      })
        .then((data) => {
          dispatch({ type: "FETCH_ALL_USERS_SUCCESS", payload: data });
          // setState({
          //   loadingUsers: false,
          //   contacts: data.users,
          //   totalOfPages: Math.ceil(data.total / 5),
          //   errorMessage: "",
          // });
        })
        .catch((err) => {
          dispatch({ type: "FETCH_ALL_USERS_ERROR", payload: err });
          // setState({
          //   loadingUsers: false,
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
