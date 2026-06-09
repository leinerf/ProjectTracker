import React from "react";
import { useNavigate } from "react-router";
import axios from "axios";

function GoogleAuth({redirectURL, authType}) {
    const navigate = useNavigate();
    const verifyUser = async () => {
        const getAccessToken = () => {
            const urlString = window.location.href;
            const delimiter = urlString.indexOf("#")
            const params = urlString.substring(delimiter + 1, urlString.length).split("&")
            for(let i = 0; i < params.length; i++){
                const param = params[i];
                const [key, value] = param.split("=")
                if(key === 'access_token') {
                    history.pushState("", document.title, window.location.pathname + window.location.search);
                    return value
                }
            }
            return "";
        }

        const token = getAccessToken()
        if(token === ""){
            navigate(redirectURL);
        }

        //TODO: verify in the backside
        // const resp = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + token);
        // const agent = new HttpsProxyAgent('http://localhost:3000');
        const resp = await axios.post(`/auth/${authType}?access_token=${token}`);
        console.log(resp.data);
        if(resp.data.verified_email){
            const { username, email } = resp.data;
            //save to local storage and go forward
            localStorage.setItem("username", username)
            localStorage.setItem("authenticated", true);
            localStorage.setItem("user-email", email)
            navigate(redirectURL);
        }
    }

    verifyUser();
    return <div>
        <p>Authenticating User.... If page is stuck try authenticating again</p>
    </div>
}

export default  GoogleAuth;