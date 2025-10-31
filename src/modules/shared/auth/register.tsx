import { useState } from "react";
import "./style.css";
import UserService from "../../../services/user.service";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", userType: "Student", email: "", password: "", repeatPassword: "" });
  const [errors, setFormErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    const newErrors = [];

    if (form.password !== form.repeatPassword) {
      newErrors.push("Passwords do not match");
    }
    if (form.password.length < 6) {
      newErrors.push("Password must be at least 6 characters");
    }
    setFormErrors(newErrors);
    if (newErrors.length === 0) {
      console.log("Form submitted successfully!");
      UserService
      .registerUser({ username: form.username, email: form.email, userType: form.userType, password: form.password, profilePicture: ""})
      .then((obj:any)=>{
        console.log(obj)        
        navigate("/login");
      })
      .catch((err)=>{
        console.log(err);
      });
    }
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
        className="d-flex w-100 align-items-center justify-content-center mt-4 mb-4 container-fluid"
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
        <input
          name="username"
          type="text"
          placeholder="username"
          onChange={handleChange}
          value={form.username}
          className="w-full mb-3 p-2 border rounded-md"
        />
        <select 
          name="userType" 
          className="w-full mb-3 p-2 border rounded-md"
          onChange={handleChange} >
          <option
            style={{color: "black"}}
            value="student">Student</option>
          <option
            style={{color: "black"}} 
            value="tutor">Tutor</option>
        </select>
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
          name="repeatPassword"
          type="password"
          placeholder="Repeat Password"
          onChange={handleChange}
          value={form.repeatPassword}
          className="w-full mb-4 p-2 border rounded-md"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
        >
          Register
        </button>
        <small className="form-text">Already have an account <a className="actionLink" href="/login">Log In</a></small>
        
        {errors.length > 0 && (
          <ul style={{ color: "red" }}>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
      </form>
    </div>    
  );
}
