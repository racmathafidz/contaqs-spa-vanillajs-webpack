function getAllUsers() {
    return fetch('https://dummyjson.com/users')
        .then((res) => res.json())
}

function getUsers({ query, limit, skip }) {
    return fetch(`https://dummyjson.com/users/search?q=${query}&limit=${limit}&skip=${skip}`)
        .then((res) => res.json())
}

function getDetailUser(id) {
    return fetch(`https://dummyjson.com/users/${id}`)
        .then((res) => res.json())
}

export { getAllUsers, getUsers, getDetailUser };