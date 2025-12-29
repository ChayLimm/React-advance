import { useNavigate } from "react-router-dom";
import type ProductProp from "./types/ProductProp";
import { Carousel, Image, Button } from "antd";

interface CardProp {
  product: ProductProp;
}

export default function ProductCard({ product }: CardProp) {
  const navigator = useNavigate();
  return (
    <div
      onClick={() => navigator(`/products/${product.id}`)}
      className="bg-white rounded-2xl"
    >
      <img src={product.images[0]} alt="" />

      <div className="flex flex-col items-start gap-1 p-2">
        <h1 className="font-bold text-start">{product.title}</h1>

      </div>
    </div>
  );
}
