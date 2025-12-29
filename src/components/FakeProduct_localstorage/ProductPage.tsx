import { useEffect, useState } from "react";
import { fetchProduct } from "./service/fetchProduct";
import { getStorage, setStorage } from "./service/cartStorage";
import type ProductProp from "./types/ProductProp";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
// import {button} from 'antd';

export default function ProductPage() {
  const [products, setProducts] = useState<ProductProp[]>([]);
  const [carts, setCarts] = useState<ProductProp[]>([]);
  const navigator = useNavigate();

  useEffect(() => {
    loadData();
    loadCard();
  }, []);

  const loadData = async () => {
    let productsData = await fetchProduct();
    setProducts(productsData);
  };

  const loadCard = async () => {
    const temp = await getStorage();
    setCarts(temp);
  };

  const addToCard = async (product: ProductProp) => {
    const updatedCart = [...carts, product];
    setCarts(updatedCart);
    await setStorage(updatedCart);
  };

  return (
    <>
      <nav className="flex items-center justify-between sticky top-0 z-10 py-3 px-4 md:px-6 bg-gray-900/90 backdrop-blur-md">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          Product
        </h1>
        <button
          type="button"
          onClick={() => navigator("/carts")}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Carts
        </button>
      </nav>

      <div className="bg-gray-100 grid grid-cols-4 gap-2">
        {products.map((product: ProductProp) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </>
  );
}
