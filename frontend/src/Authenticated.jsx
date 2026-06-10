import { Outlet, useNavigate } from "react-router";
import { clearClientAuth, isAuthenticated } from "../util/auth";
import axios from "axios";

function Authenticated() {
    if(!isAuthenticated()) {
        axios.get("/auth/logout");
        clearClientAuth();
        const navigate = useNavigate();
        navigate("/")
    }
    return (
        <div>
            <Outlet />
        </div>
    );
}

export default Authenticated;