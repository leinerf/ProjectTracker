import { Outlet, useNavigate } from "react-router";
import { clearClientAuth, isAuthenticated } from "../util/auth";
import axios from "axios";
import { useEffect } from "react";

function Authenticated() {
    const navigate = useNavigate();
    useEffect(() => {
        if(!isAuthenticated()) {
            axios.get("/auth/logout");
            clearClientAuth();
            navigate("../")
        }
    }, []) 
    
    return (
        <div className="s-container">
            <Outlet />
        </div>
    );
}

export default Authenticated;