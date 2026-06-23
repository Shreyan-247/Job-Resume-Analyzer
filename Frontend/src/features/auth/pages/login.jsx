import React,{useState} from "react";
import "../auth.form.scss";
import {useNavigate,Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";



const Login = () => {
    const {loading,handleLogin} = useAuth();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    /**
     * @name handleLogin
     * @desc the function will prevent default form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await handleLogin(email, password);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    if(loading){
        return (<main><h1>Loading.....</h1></main>);
    }

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" onChange={(e) => setEmail(e.target.value)} id="email" name="email" placeholder="Enter Email" required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" onChange={(e) => setPassword(e.target.value)} id="password" name="password" placeholder="Enter Password" required />
                    </div>
                    <br></br>
                    <hr></hr>
                    <br></br>
                    <button type="submit" className="button primary-class-button">Login</button>
                </form>
                <p>Don't have an account ? <Link to="/signup">Sign Up</Link></p>
            </div>
        </main>
    )
}

export default Login