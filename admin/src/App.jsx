import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  Overview,
  Layout,
  Products,
  Categories,
  Orders,
  Default,
  Customers,
  Employees,
} from "./handler";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Default />} />
          <Route path="/overview" element={<Overview />}></Route>
          <Route path="/employees" element={<Employees />}></Route>
          <Route path="/customers" element={<Customers />}></Route>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/categories" element={<Categories />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
