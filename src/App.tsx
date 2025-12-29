import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProductPage from './components/FakeProduct_localstorage/ProductPage'
import CartPage from './components/FakeProduct_localstorage/CartPage'
import ProductDetails from './components/FakeProduct_localstorage/ProductDetails'
import RegisterPage from './components/Portfolio_firebase/RegisterPage'
import LoginPage from './components/Portfolio_firebase/LoginPage'
import Dashboard from './components/Portfolio_firebase/Dashboard'
import Portfolio from './components/Portfolio_firebase/Portfolio'


function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/products" element={<ProductPage />} />
      <Route path='/carts' element={<CartPage/>} /> 
      <Route path='/products/:id' element={<ProductDetails/>} /> 
      <Route path='/register' element={<RegisterPage/>} />
      <Route path='/login' element={<LoginPage/>} />
      <Route path='/dashboard' element={<Dashboard/>} />
      <Route path='/portfolio' element={<Portfolio/>} />

    </Routes>
  </BrowserRouter>
  )
}

export default App
