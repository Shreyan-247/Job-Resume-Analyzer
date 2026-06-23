import React,{useState} from "react";
import "../auth.form.scss";
import {useNavigate,Link} from "react-router-dom";
import {useAuth} from "../hooks/useAuth.js";

const Signup = () => {

    const {loading,handleRegister} = useAuth();
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();
    /**
     * @name handleSubmit
     * @desc the function will prevent default form submission
     */
    const handleSubmit = async(e) => {
        e.preventDefault();
        await handleRegister(username,email,password);
        navigate("/");
    };

    if(loading){
        return (<main><h1>Loading.....</h1></main>);
    }

    return (
        <main>
            <div className="form-container">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" onChange={(e) => setUsername(e.target.value)} id="username" name="username" placeholder="Enter Username" required />
                    </div>
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
                    <button type="submit" className="button secondary-class-button">Signup</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
    )
}

export default Signup