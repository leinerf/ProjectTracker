import React from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Button from 'react-bootstrap/Button';
import { setClientAuth } from "../util/auth";

function GoogleAuth({redirectURL, authPath}) {
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
        try{
            const resp = await axios.get(`/auth/${authPath}?access_token=${token}`);
            if(resp.status === 200){
                const { username, email, jwt_exp } = resp.data;
                if(username === undefined || email === undefined || jwt_exp === undefined){
                    throw new Error("required info not recieved");
                }
                setClientAuth({username, email, jwt_exp})
                navigate(redirectURL);
            } else {
                throw new Error("status code was not 200: " +  resp.status);
            }
        } catch(err){
            console.error(err)
        }
    }

    verifyUser();
    return <div>
        <p>Authenticating User.... If page is stuck try authenticating again</p>
        <Button variant="success" className="align-text" onClick={() => {navigate("/")}}>
            Go Back
        </Button>
    </div>
}

export default  GoogleAuth;