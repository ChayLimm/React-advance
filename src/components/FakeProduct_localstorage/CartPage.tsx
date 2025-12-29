import { useEffect, useState } from 'react'
import type ProductProp from './types/ProductProp'
import { setStorage, getStorage } from './service/cartStorage'

// Component for the remove icon (can be moved to a separate file)
const RemoveIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
    />
  </svg>
)

export default function CartPage() {
  const [carts, setCarts] = useState<ProductProp[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const temp = await getStorage()
    setCarts(temp)
  }

  const removeFromCart = async (product: ProductProp) => {
    const updatedCart = carts.filter((item) => item.id !== product.id)
    setCarts(updatedCart)
    await setStorage(updatedCart)
  }

  const calculateTotal = () => {
    return carts.reduce((sum, item) => sum + item.price, 0).toFixed(2)
  }

  if (carts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-6">
                <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Add some products to get started!</p>
              <a 
                href="/products" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {carts.map((cart: ProductProp) => (
                <div 
                  key={cart.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="sm:w-48 w-full">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          {cart.images?.[0] ? (
                            <img 
                              src={cart.images[0]} 
                              alt={cart.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
                                e.currentTarget.onerror = null
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200">
                              <span className="text-gray-400">No Image</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                              {cart.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <span className="text-2xl font-bold text-blue-700">
                                ${cart.price.toFixed(2)}
                              </span>
                              {cart.category && (
                                <span className="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                                  {cart.category.name}
                                </span>
                              )}
                            </div>
                          </div>

                          <button 
                            onClick={() => removeFromCart(cart)}
                            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
                            aria-label="Remove item"
                          >
                            <RemoveIcon />
                          </button>
                        </div>

                        <p className="text-gray-600 mb-6 line-clamp-2">
                          {cart.description}
                        </p>

                        <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>ID: #{cart.id}</span>
                       
                          </div>

                          <button 
                            onClick={() => removeFromCart(cart)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors duration-200"
                          >
                            <RemoveIcon className="h-4 w-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({carts.length} items)</span>
                  <span className="font-medium">${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-2xl">${calculateTotal()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Including $0.00 in taxes</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}