import express from "express";
import { getCategory } from "../controller/category.controller.js";
import { getAlLProduct } from "../controller/product.controller.js";

const publicRoutes = express.Router();

publicRoutes.get("/products", getAlLProduct);
publicRoutes.get("/categories", getCategory);

export default publicRoutes;
