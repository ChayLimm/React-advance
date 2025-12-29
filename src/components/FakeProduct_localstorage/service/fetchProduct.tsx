const url = "https://api.escuelajs.co/api/v1/products"

export  function fetchProduct() {
  const products = fetch(url).then((res)=> res.json())
  return products; 
}

export const fetchProductById =  (id : number)=>{
    const product = fetch(`${url}/${id}`).then((res)=>res.json())
    return product
}