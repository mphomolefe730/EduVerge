import { useState } from "react";
import "./style.css";
import UserService from "../../../services/user.service";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    UserService
    .loginUser({email: form.email, password: form.password})
    .then((obj:any)=>{
      console.log(obj)
    })
    .catch((err)=>{
      console.log(err);
    });
  };

  return (
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
    </form>
  );
}
