/**
 * gets the user by the storaged token
 * @returns {boolean} true: user succesfully found and saved / false: something went wrong
 */
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
        .then(data => { //user was found the in the data base -> set the name in the locale storage
            localStorage.setItem("user", data.name);
            return true;
        })
        .catch(err => { //Something went wrong -> remove token and user from the lcoale storage
            console.log("The following error occurred while getting user: ", err);
            localStorage.removeItem("token");
            localStorage.removeItem("user")
            return false;
        });
};

/**
 * sends an API request to register the user 
 * @param {string} name of the user
 * @param {string} password of the user
 */
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
            if (data.token) { //user successfully registered
                console.log("User successfully registered")
                    //set the token in the locale storage
                localStorage.setItem("token", data.token);
                //set the name in the locale storage
                localStorage.setItem("user", data.user.name);
                return data;
            }
            //Something went wrong -> probably the username is already taken
            console.log(data.msg)
            return data;
        })
        .catch(err => {
            console.log("Error occurred during the login: ", err)
            return false;
        })
};

/**
 * sends an API request to log the user in
 * @param {string} name of the user
 * @param {string} password of the user
 */
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
            if (data.token) { //user successfully logged in 
                console.log("User successfully logged in")
                    //set the token in the local storage
                localStorage.setItem("token", data.token);
                //set the name in the local storage
                localStorage.setItem("user", data.user.name);
                return data;
            }
            return data;
        })
        .catch(err => {
            console.log("Error")
            return err;
        })
};

/**
 * Logs the user out by removing everything from the locale storage
 */
const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    console.log("User is logged out");
};

/**
 * @returns {JSON} the header with the saved token and content-type application/json
 */
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