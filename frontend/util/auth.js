import axios from "axios";

const signInGoogleAuth = (redirectPath) => {
    let oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Create <form> element to submit parameters to OAuth 2.0 endpoint.
    let form = document.createElement('form');
    form.setAttribute('method', 'GET'); // Send as a GET request.
    form.setAttribute('action', oauth2Endpoint);

    // Parameters to pass to OAuth 2.0 endpoint.
    let params = {
        'client_id': ENV_CLIENT_ID,
        'redirect_uri': BASE_URL + "/" + redirectPath,
        'response_type': 'token',
        'scope': 'https://www.googleapis.com/auth/userinfo.email',
        'include_granted_scopes': 'true',
        'state': 'pass-through value',
        'prompt': 'select_account'
    };

    // Add form parameters as hidden input values.
    for (let p in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    // Add form to page and submit it to open the OAuth 2.0 endpoint.
    document.body.appendChild(form);
    form.submit();
}

const setClientAuth = ({ username, email, jwt_exp }) => {
    const { username: oldUsername, email: oldEmail, jwt_exp: oldJwt_exp } = localStorage;
    localStorage.setItem("username", username || oldUsername);
    localStorage.setItem("email", email || oldUsername);
    localStorage.setItem("jwt_exp", jwt_exp || oldJwt_exp);
}

const getClientAuth = () => {
    const { username, email, jwt_exp } = localStorage;
    return { username, email, jwt_exp };
}

const clearClientAuth = () => {
    localStorage.clear();
}

const isAuthenticated = () => {
    const { jwt_exp } = getClientAuth();
    const date = new Date();
    return jwt_exp !== undefined && date < jwt_exp;
}

export { signInGoogleAuth, isAuthenticated, setClientAuth, getClientAuth, clearClientAuth }