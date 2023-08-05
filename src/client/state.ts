import App from "./App";
import { Contact, getContacts, getDetailContact } from "./utils/index";

type State = {
  path: string;
  contactId: Contact["id"] | null;
  homePage: {
    tag:
      | "idle"
      | "loading"
      | "success"
      | "error"
      | "changing_page"
      | "changing_page_error";
    inputValue: string;
    contacts: Contact[];
    totalOfPages: number;
    pageSkip: number;
    errorMessage: string;
  };
  detailPage: {
    tag: "idle" | "loading" | "success" | "error";
    contact: Contact | null;
    errorMessage: string;
  };
  favoritePage: {
    tag: "idle" | "loading" | "success" | "error";
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
      type: "CHANGE_PAGE_ERROR";
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
    }
  | { type: "FETCH_FAVORITE_CONTACTS" };

const contactIdParam = new URL(window.location.href).searchParams.get("id");

export let state: State = {
  path: window.location.pathname,
  contactId: contactIdParam ? parseInt(contactIdParam) : null,
  homePage: {
    tag: "idle",
    inputValue: localStorage.getItem("inputValue") ?? "",
    contacts: [],
    totalOfPages: 0,
    pageSkip: 0,
    errorMessage: "",
  },
  detailPage: {
    tag: "idle",
    contact: null,
    errorMessage: "",
  },
  favoritePage: {
    tag: "idle",
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
  switch (prevState.homePage.tag) {
    case "idle": {
      switch (action.type) {
        case "FETCH_ALL_CONTACTS": {
          return {
            ...prevState,
            homePage: {
              ...prevState.homePage,
              tag: "loading",
            },
          };
        }
      }
    }
    case "loading": {
      switch (action.type) {
        case "FETCH_ALL_CONTACTS_SUCCESS": {
          return {
            ...prevState,
            homePage: {
              ...prevState.homePage,
              tag: "success",
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
              tag: "error",
              contacts: [],
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
      }
    }
    case "success": {
      switch (action.type) {
        case "CHANGE_INPUT": {
          return {
            ...prevState,
            homePage: {
              ...prevState.homePage,
              inputValue: action.payload,
              tag: "loading",
            },
          };
        }
        case "CLEAR_INPUT": {
          return {
            ...prevState,
            homePage: {
              ...prevState.homePage,
              inputValue: "",
              tag: "loading",
            },
          };
        }
        case "CHANGE_PAGE": {
          return {
            ...prevState,
            path: action.payload,
            homePage: {
              ...prevState.homePage,
              tag: "changing_page",
            },
          };
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
      }
    }
    case "error": {
      switch (action.type) {
        case "CHANGE_INPUT": {
          return {
            ...prevState,
            homePage: {
              ...prevState.homePage,
              inputValue: action.payload,
              tag: "loading",
            },
          };
        }
        case "CLEAR_INPUT": {
          return {
            ...prevState,
            homePage: {
              ...prevState.homePage,
              inputValue: "",
              tag: "loading",
            },
          };
        }
        case "CHANGE_PAGE": {
          return {
            ...prevState,
            path: action.payload,
            homePage: {
              ...prevState.homePage,
              tag: "changing_page",
            },
          };
        }
        case "FETCH_ALL_CONTACTS": {
          return {
            ...prevState,
            homePage: {
              ...prevState.homePage,
              tag: "loading",
            },
          };
        }
      }
    }
    case "changing_page": {
      switch (action.type) {
        case "SET_PAGINATION": {
          return {
            ...prevState,
            homePage: {
              ...prevState.homePage,
              pageSkip: action.payload,
              tag: "changing_page",
            },
          };
        }
        case "FETCH_ALL_CONTACTS_SUCCESS": {
          return {
            ...prevState,
            homePage: {
              ...prevState.homePage,
              tag: "success",
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
              tag: "changing_page_error",
              contacts: [],
              errorMessage: action.payload.message,
            },
          };
        }
        // case "CHANGE_PAGE": {
        //   return {
        //     ...prevState,
        //     path: action.payload,
        //     homePage: {
        //       ...prevState.homePage,
        //       tag: "success",
        //     },
        //   };
        // }
        // case "CHANGE_PAGE_ERROR": {
        //   return {
        //     ...prevState,
        //     homePage: {
        //       ...prevState.homePage,
        //       tag: "changing_page_error",
        //     },
        //   };
        // }
      }
    }
    case "changing_page_error": {
      switch (action.type) {
        case "CHANGE_PAGE": {
          return {
            ...prevState,
            path: action.payload,
            homePage: {
              ...prevState.homePage,
              tag: "changing_page",
            },
          };
        }
      }
    }
  }
  switch (prevState.detailPage.tag) {
    case "idle": {
      switch (action.type) {
        case "FETCH_DETAIL_CONTACT": {
          return {
            ...prevState,
            detailPage: {
              ...prevState.detailPage,
              tag: "loading",
            },
          };
        }
      }
    }
    case "loading": {
      switch (action.type) {
        case "FETCH_DETAIL_CONTACT_SUCCESS": {
          return {
            ...prevState,
            detailPage: {
              ...prevState.detailPage,
              tag: "success",
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
              tag: "error",
              contact: null,
              errorMessage: action.payload.message,
            },
          };
        }
      }
    }
    case "success": {
      switch (action.type) {
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
        case "CHANGE_PAGE": {
          return {
            ...prevState,
            path: action.payload,
            homePage: {
              ...prevState.homePage,
              tag: "changing_page",
            },
          };
        }
      }
    }
    case "error": {
      switch (action.type) {
        case "FETCH_DETAIL_CONTACT": {
          return {
            ...prevState,
            detailPage: {
              ...prevState.detailPage,
              tag: "loading",
            },
          };
        }
      }
    }
  }
  switch (prevState.favoritePage.tag) {
    case "idle": {
      switch (action.type) {
        case "FETCH_FAVORITE_CONTACTS": {
          return {
            ...prevState,
            detailPage: {
              ...prevState.detailPage,
              tag: "loading",
            },
          };
        }
      }
    }
  }
  switch (action.type) {
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
    case "CHANGE_PAGE": {
      return {
        ...prevState,
        path: action.payload,
      };
    }
    case "SET_CONTACT_ID": {
      return { ...prevState, contactId: action.payload };
    }
  }
  return prevState;
}

export function dispatch(action: Action) {
  const newState = reducer(state, action);
  setState(newState);
}

export function onStateChange(prevState: State, nextState: State) {
  if (prevState.path != nextState.path) {
    const url = new URL(window.location.href);
    // url.search = "";
    url.pathname = nextState.path;
    history.pushState(null, "", url.toString());
    setState({
      contactId: null,
      homePage: {
        ...nextState.homePage,
        tag: "idle",
        contacts: [],
        totalOfPages: 0,
        pageSkip: 0,
        errorMessage: "",
      },
      detailPage: {
        tag: "idle",
        contact: null,
        errorMessage: "",
      },
      favoritePage: {
        ...nextState.favoritePage,
        tag: "idle",
        // contacts: [],
        errorMessage: "",
      },
    });
  }
  if (prevState.contactId !== nextState.contactId) {
    const url = new URL(window.location.href);
    if (nextState.contactId === null) {
      url.searchParams.delete("id");
    } else {
      url.searchParams.set("id", nextState.contactId.toString());
      // dispatch({ type: "FETCH_DETAIL_CONTACT" });
      // setState({ loadingDetailContact: true });
      // getDetailContact(nextState.contactId)
      //   .then((data) => {
      //     dispatch({ type: "FETCH_DETAIL_CONTACT_SUCCESS", payload: data });
      //   })
      //   .catch((err) => {
      //     dispatch({ type: "FETCH_DETAIL_CONTACT_ERROR", payload: err });
      //   });
    }
    history.pushState({}, "", url.toString());
  }
  // if (
  //   prevState.homePage?.inputValue !== nextState.homePage.inputValue ||
  //   prevState.homePage?.pageSkip !== nextState.homePage.pageSkip
  // ) {
  //   localStorage.setItem("inputValue", nextState.homePage.inputValue);
  //   dispatch({ type: "FETCH_ALL_CONTACTS" });

  //   if (timeout) {
  //     clearTimeout(timeout);
  //   }

  //   timeout = setTimeout(() => {
  //     getContacts({
  //       query: nextState.homePage.inputValue,
  //       limit: 5,
  //       skip: nextState.homePage.pageSkip,
  //     })
  //       .then((data) => {
  //         dispatch({ type: "FETCH_ALL_CONTACTS_SUCCESS", payload: data });
  //       })
  //       .catch((err) => {
  //         dispatch({ type: "FETCH_ALL_CONTACTS_ERROR", payload: err });
  //       });
  //   }, 600);
  // }
  if (nextState.path === "/home") {
    switch (nextState.homePage.tag) {
      case "idle":
        dispatch({ type: "FETCH_ALL_CONTACTS" });
        break;
      case "loading":
        localStorage.setItem("inputValue", nextState.homePage.inputValue);

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
            })
            .catch((err) => {
              dispatch({ type: "FETCH_ALL_CONTACTS_ERROR", payload: err });
            });
        }, 600);
        break;
      case "changing_page":
        getContacts({
          query: nextState.homePage.inputValue,
          limit: 5,
          skip: nextState.homePage.pageSkip,
        })
          .then((data) => {
            dispatch({ type: "FETCH_ALL_CONTACTS_SUCCESS", payload: data });
          })
          .catch((err) => {
            dispatch({ type: "FETCH_ALL_CONTACTS_ERROR", payload: err });
          });
        break;
    }
  }
  if (nextState.path === "/contact-detail") {
    console.log("Detail");
    switch (nextState.detailPage.tag) {
      case "idle":
        dispatch({ type: "FETCH_DETAIL_CONTACT" });
        break;
      case "loading":
        if (nextState.contactId !== null) {
          getDetailContact(nextState.contactId)
            .then((data) => {
              dispatch({ type: "FETCH_DETAIL_CONTACT_SUCCESS", payload: data });
            })
            .catch((err) => {
              dispatch({ type: "FETCH_DETAIL_CONTACT_ERROR", payload: err });
            });
        }
        break;
    }
  }
  // if (nextState.path === "/favorite") {
  //   switch (nextState.favoritePage.tag) {
  //     case
  //   }
  // }
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
