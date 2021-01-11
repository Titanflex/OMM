// Load user by token
const getUser = () => () => {

    fetch("http://localhost:3030/auth/user", {
            method: "GET",
            mode: "cors",
            headers: getTokenHeader()
        }).then(response => response.json())
        .then(data => {
            localStorage.setItem("user", data.user);
        })
        .catch(err => {

        })
};

// Register User
const register = ({ name, password }) => (
    dispatch
) => {
    fetch("http://localhost:3030/auth/register", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, password }),
        }).then(response => response.json())
        .then(data => {
            localStorage.setItem("token", data.token);
        })
        .catch(err => {

        })
};

// Login User
const login = (name, password) => {
    return fetch("http://localhost:3030/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, password }),
        })
        .then(response => {
            response.json()
        })
        .then(data => {
            localStorage.setItem("token", data.token);
        })
        .catch(err => {})
};

// Logout User
const logout = () => {
    localStorage.removeItem("token")
};

// Setup headers with token
const getTokenHeader = () => {

    // Get token from localstorage
    const token = localStorage().getItem("token");

    // Headers
    const header = {
        'Content-type': 'application/json',
        'x-auth-token': token
    };

    return header;
};

export default {
    register,
    login,
    logout,
    getUser,
    getTokenHeader
};