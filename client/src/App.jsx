import { useState } from "react";
import "./App.css";
import { Header, Navbar, Home, Footer, Notfound, AdminLayout } from "./handler";
import { Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <Home></Home>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout></AdminLayout>}></Route>
      </Routes>
    </>
  );
}

export default App;
