import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
interface Rating {
  rate: number;
  count: number;
}

export default function FakeProduct() {
  const url = "https://fakestoreapi.com/products";

  const [data, setData] = useState<Product[]>([]);

  useEffect(() => {
    fetchFakeProduct();
  }, []);

  const fetchFakeProduct = async () => {
    const res = await fetch(url).then((res) => res.json());
    console.log(data);
    setData(res);
    return data;
  };

  return (
    <>
      <h1 className="text-2xl">Testing Fake Product API</h1>
     <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-2 transition-all duration-300">
       {data.map((product: Product) => (
        <Product key={product.id} product={product} />
      ))}
     </div>
    </>
  );
}

export function Product({ product }: { product: Product }) {
  return (
    <div className="flex flex-col p-4 rounded-lg border border-gray-200 m-4">
      <img src={product.image} alt="" className="w-32 h-24" />
      <h2 className="text-black font-bold">{product.title}</h2>
      <p className="text-black">{product.description}</p>
    </div>
  );
}
