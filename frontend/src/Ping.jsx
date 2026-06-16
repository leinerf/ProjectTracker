import Button from 'react-bootstrap/Button';
import axios from 'axios';

function Ping() {
    const pingServer = async () => {
        const resp = await axios.get("/auth/pingCookie");
        console.log(resp.data);
    }
    return (
        <div className="center-content" style={{height: "100vh"}}>
            <h1>Press the button to ping for cookies</h1>
            <Button variant="primary" onClick={pingServer}>Ping Cookie</Button>
        </div> 
    )
}

export default Ping;