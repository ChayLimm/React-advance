import type ProductProp from "../types/ProductProp";

export async function getStorage() {
  const temp = localStorage.getItem("cart");
  return temp ? JSON.parse(temp) : [];
}

export async function setStorage(cart: ProductProp[]) {
  const temp = JSON.stringify(cart);
  localStorage.setItem("cart", temp);
  return;
}