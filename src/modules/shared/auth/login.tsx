import { useState } from "react";
import "./style.css";
import UserService from "../../../services/user.service";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e:any) => {
    setError("");
    e.preventDefault();
    UserService
    .loginUser({email: form.email, password: form.password})
    .then((obj:any)=>{
      if(obj.data?.error){
        setError("User not found or incorrect credentials.");
        return
      }
      if (obj.status === 200 && obj.data.message === "Login Successful")
      {
        sessionStorage.setItem("EduVergeToken", obj.data.token);
        navigate("/dashboard");
      }
    })
    .catch((err)=>{
       setError(err.error);
    });
  };

  return (
    <div id="homePageMainContainer" style={{ height: "100svh"}}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <i className="fas fa-graduation-cap text-white text-xl"></i>
        </div>
          <a href="/" className="text-xl font-bold text-white">EDU<span className="text-accent">VERGE</span></a>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{margin: "auto"}}
        className="d-flex w-100 align-items-center justify-content-center m-0 mt-4 mb-4 container-fluid"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          value={form.email}
          className="w-full mb-3 p-2 border rounded-md"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          value={form.password}
          className="w-full mb-4 p-2 border rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
        <small className="form-text">Don't have an account? <a className="actionLink" href="/register">Sign Up</a></small>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}
