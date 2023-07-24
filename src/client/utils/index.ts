type GetContactsResponse = {
  users: Contact[];
  total: number;
  skip: number;
  limit: number;
};

export type Contact = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female";
  phone: string;
  email: string;
};

// function getAllContacts(): Promise<GetContactsResponse> {
//   return fetch("https://dummyjson.com/users").then((res) => res.json());
// }

type GetContactsParams = {
  query: string;
  limit: number;
  skip: number;
};

function getContacts({
  query,
  limit,
  skip,
}: GetContactsParams): Promise<GetContactsResponse> {
  return fetch(
    `https://dummyjson.com/users/search?q=${query}&limit=${limit}&skip=${skip}`
  ).then((res) => res.json());
}

function getDetailContact(id: Contact["id"]) {
  return fetch(`https://dummyjson.com/users/${id}`).then((res) => res.json());
}

export { getContacts, getDetailContact };
