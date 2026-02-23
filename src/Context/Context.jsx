import axios from "../axios";
import { useState, useEffect, createContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AppContext = createContext({
  data: [],
  isError: "",
  cart: [],
  user:"",
  token:"",
  addToCart: (product) => {},
  authLogin : (jwtToken) => {},
  removeFromCart: (productId) => {},
  refreshData:() =>{},
  updateStockQuantity: (productId, newQuantity) =>{}
  
});

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const [user, setUser] = useState("");
  const [token, setToken] = useState(localStorage.getItem('token') || "");

    useEffect(()=>{
        if(token){
            const decodeUser = jwtDecode(token);
            setUser(decodeUser);
        }
    },[token]);

    const authLogin = (jwtToken) => {
        localStorage.setItem('token', jwtToken);
        setToken(jwtToken);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
    }

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (productId) => {
    console.log("productID",productId)
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log("CART",cart)
  };

  const refreshData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/products`);
      setData(response.data);
    } catch (error) {
      setIsError(error.message);
    }
  };

  const clearCart =() =>{
    setCart([]);
  }
  
  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  return (
    <AppContext.Provider value={{ user, token, authLogin, logout, data, isError, cart, addToCart, removeFromCart,refreshData, clearCart  }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
