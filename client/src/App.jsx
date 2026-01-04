import { useState } from "react";
import "./App.css";
import { Header, Navbar, Home, Footer, Notfound } from "./handler";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    
      <Home></Home>
      <Footer></Footer>
    </>
  );
}

export default App;
