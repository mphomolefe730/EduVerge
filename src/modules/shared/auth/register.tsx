import { useState } from "react";
import "./style.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Registered: ${form.name}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{margin: "auto"}}
      className="d-flex w-100 align-items-center justify-content-center mt-4 mb-4 container-fluid"
    >
      <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
      <input
        name="firstname"
        type="text"
        placeholder="First Name"
        onChange={handleChange}
        value={form.name}
        className="w-full mb-3 p-2 border rounded-md"
      />
      <input
        name="lastname"
        type="text"
        placeholder="Last Name"
        onChange={handleChange}
        value={form.name}
        className="w-full mb-3 p-2 border rounded-md"
      />
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
      
      <input
        name="repeatpassword"
        type="password"
        placeholder="Repeat Password"
        onChange={handleChange}
        value={form.password}
        className="w-full mb-4 p-2 border rounded-md"
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
      >
        Register
      </button>
      <small className="form-text">Already have an account <a className="actionLink" href="/login">Log In</a></small>
    </form>
    
  );
}
