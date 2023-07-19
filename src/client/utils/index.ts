type GetUsersResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female";
  phone: string;
  email: string;
};

// function getAllUsers(): Promise<GetUsersResponse> {
//   return fetch("https://dummyjson.com/users").then((res) => res.json());
// }

type GetUsersParams = {
  query: string;
  limit: number;
  skip: number;
};

function getUsers({
  query,
  limit,
  skip,
}: GetUsersParams): Promise<GetUsersResponse> {
  return fetch(
    `https://dummyjson.com/users/search?q=${query}&limit=${limit}&skip=${skip}`
  ).then((res) => res.json());
}

function getDetailUser(id: User["id"]) {
  return fetch(`https://dummyjson.com/users/${id}`).then((res) => res.json());
}

export { getUsers, getDetailUser };
