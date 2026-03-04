import express from "express";
import { getAllProducts } from "../controller/product.controller.js.js";
const publicRoutes = express.Router();

publicRoutes.get("/products", getAllProducts);

export default publicRoutes;
