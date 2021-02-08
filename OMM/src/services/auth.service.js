// Load user by token 
const getUser = () => {
    return fetch("http://localhost:3030/auth/user", {
            method: "GET",
            mode: "cors",
            headers: getTokenHeader()
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem("user", data.name);
            return true;
        })
        .catch(err => {
            console.log("The following error occurred while getting user:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user")
            return false;
        });
};

// Register User
const register = (name, password) => {
    return fetch("http://localhost:3030/auth/register", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, password }),
        })
        .then((response => response.json()))
        .then(data => {
            if (data.token) {
                console.log("User successfully registered")
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", data.user.name);
                return data;
            }
            console.log(data.msg)
            return true;
        })
        .catch(err => {
            console.log("Error occurred during the login")
            return false;
        })
};

// Login User
const login = (name, password) => {
    return fetch("http://localhost:3030/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, password }),
        })
        .then((response => response.json()))
        .then(data => {
            if (data.token) {
                console.log("User successfully logged in")
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", data.user.name);
                return data;
            }
            console.log(data.msg)
            return data;
        })
        .catch(err => {
            console.log("Error")
            return err;
        })
};

// Logout User
const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("User is logged out");
};

// Setup headers with token to get user data
const getTokenHeader = () => {

    // Get token from localstorage
    const token = localStorage.getItem("token");

    // Headers
    const header = {
        "Content-Type": "application/json",
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