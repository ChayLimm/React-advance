import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById } from './service/fetchProduct';
import type ProductProp from './types/ProductProp';
import { getStorage, setStorage } from './service/cartStorage';

export default function ProductDetails() {
    const [product, setProducts] = useState<ProductProp>();
    const { id } = useParams();
    const navigator = useNavigate()

    useEffect(()=>{
        loadData()
    })

    const loadData = async()=>{
       const temp = await fetchProductById(parseInt(id!))
       setProducts(temp);
    }

    const addToCard = async (product: ProductProp) => {
        const carts = await getStorage()
        const updatedCart = [... carts, product];
        await setStorage(updatedCart);
    };

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Image on the left */}
                <div className="md:w-1/2">
                    {product.images.length > 0 ? (
                        <div className="space-y-4">
                            <div className="border rounded-lg overflow-hidden">
                                <img 
                                    src={product.images[0]} 
                                    alt={product.title}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                            {product.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto py-2">
                                    {product.images.map((image, index) => (
                                        <div key={index} className="flex-shrink-0 w-20 h-20 border rounded overflow-hidden">
                                            <img 
                                                src={image} 
                                                alt={`${product.title} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="border rounded-lg h-64 flex items-center justify-center bg-gray-100">
                            <span className="text-gray-500">No image available</span>
                        </div>
                    )}
                </div>

                <div className="md:w-1/2 space-y-6">
                    <div className="inline-block">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            {product.category.name}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

                    <div className="text-2xl font-bold text-blue-600">
                        ${product.price.toFixed(2)}
                    </div>

                    <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>

                    <div className="pt-4 border-t">
                        <div className="text-sm text-gray-500">
                            Product ID: <span className="font-mono">{product.id}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                            Slug: <span className="font-mono">{product.slug}</span>
                        </div>
                    </div>
                    <div className="pt-4">
                        <button
                            onClick={()=>{
                                addToCard(product)
                                alert("Success")
                                navigator('/products')
                            }}
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}