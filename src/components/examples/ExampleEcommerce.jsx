import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Heart, Star, Plus, Minus, X, Check } from "lucide-react";

const ExampleEcommerce = () => {
  const [products] = useState([
    {
      id: 1,
      name: "Auriculares Inalámbricos Premium",
      price: 129.99,
      rating: 4.8,
      image: "headphones",
      category: "electrónica",
      description: "Auriculares inalámbricos con cancelación de ruido y 30 horas de batería."
    },
    {
      id: 2,
      name: "Zapatillas Deportivas Ultra",
      price: 89.99,
      rating: 4.5,
      image: "shoes",
      category: "deportes",
      description: "Zapatillas ligeras y cómodas, perfectas para correr o entrenar."
    },
    {
      id: 3,
      name: "Cámara Digital 4K",
      price: 349.99,
      rating: 4.7,
      image: "camera",
      category: "electrónica",
      description: "Cámara digital con grabación 4K, zoom óptico 10x y estabilización de imagen."
    },
    {
      id: 4,
      name: "Reloj Inteligente Series 5",
      price: 199.99,
      rating: 4.6,
      image: "smartwatch",
      category: "electrónica",
      description: "Reloj inteligente con monitor de salud, GPS y resistencia al agua."
    },
    {
      id: 5,
      name: "Mochila Impermeable Pro",
      price: 59.99,
      rating: 4.4,
      image: "backpack",
      category: "accesorios",
      description: "Mochila espaciosa con compartimentos para laptop y accesorios."
    },
    {
      id: 6,
      name: "Altavoz Bluetooth Portátil",
      price: 79.99,
      rating: 4.3,
      image: "speaker",
      category: "electrónica",
      description: "Altavoz con sonido 360°, resistente al agua y 20 horas de batería."
    }
  ]);
  
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState("todos");
  const [favorites, setFavorites] = useState([]);
  const { toast } = useToast();

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast({
      title: "Producto añadido",
      description: `${product.name} se ha añadido al carrito`,
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
    
    toast({
      title: "Producto eliminado",
      description: "El producto se ha eliminado del carrito",
    });
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
      toast({
        title: "Añadido a favoritos",
        description: "El producto se ha añadido a tus favoritos",
      });
    }
  };

  const filteredProducts = activeCategory === "todos" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const checkout = () => {
    toast({
      title: "Pedido realizado",
      description: `Tu pedido por €${subtotal.toFixed(2)} ha sido procesado correctamente`,
    });
    setCart([]);
    setShowCart(false);
  };

  const getProductImage = (imageName) => {
    switch (imageName) {
      case "headphones":
        return (
          <img  alt="Auriculares inalámbricos premium de color negro" src="https://images.unsplash.com/photo-1678470703323-19ef0ca91362" />
        );
      case "shoes":
        return (
          <img  alt="Zapatillas deportivas modernas de color azul" src="https://images.unsplash.com/photo-1625210552378-44b08ad1da75" />
        );
      case "camera":
        return (
          <img  alt="Cámara digital profesional negra" src="https://images.unsplash.com/photo-1617036083087-ce31fac66b23" />
        );
      case "smartwatch":
        return (
          <img  alt="Reloj inteligente con correa negra" src="https://images.unsplash.com/photo-1671195828444-eb720226a961" />
        );
      case "backpack":
        return (
          <img  alt="Mochila impermeable de color gris" src="https://images.unsplash.com/photo-1681334921913-ef3a502ffc81" />
        );
      case "speaker":
        return (
          <img  alt="Altavoz bluetooth portátil negro" src="https://images.unsplash.com/photo-1581354781585-7a12cba68d30" />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Tienda Online</h2>
          
          <Button 
            onClick={() => setShowCart(true)}
            className="relative bg-indigo-600 hover:bg-indigo-700"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant={activeCategory === "todos" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveCategory("todos")}
            className={activeCategory === "todos" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Todos
          </Button>
          <Button 
            variant={activeCategory === "electrónica" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveCategory("electrónica")}
            className={activeCategory === "electrónica" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Electrónica
          </Button>
          <Button 
            variant={activeCategory === "deportes" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveCategory("deportes")}
            className={activeCategory === "deportes" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Deportes
          </Button>
          <Button 
            variant={activeCategory === "accesorios" ? "default" : "outline"} 
            size="sm"
            onClick={() => setActiveCategory("accesorios")}
            className={activeCategory === "accesorios" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            Accesorios
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="w-full h-full">
                  {getProductImage(product.image)}
                </div>
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
                >
                  <Heart 
                    className={`h-5 w-5 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} 
                  />
                </button>
              </div>
              
              <div className="p-4">
                <div className="flex items-center mb-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-amber-400" : ""}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">{product.rating}</span>
                </div>
                
                <h3 className="font-bold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-indigo-600">€{product.price.toFixed(2)}</span>
                  <Button 
                    onClick={() => addToCart(product)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Añadir
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showCart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
              onClick={() => setShowCart(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween" }}
                className="bg-white w-full max-w-md h-full overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                  <h3 className="text-xl font-bold">Tu Carrito ({totalItems})</h3>
                  <button
                    onClick={() => setShowCart(false)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="p-4">
                  {cart.length > 0 ? (
                    <>
                      <div className="space-y-4 mb-6">
                        {cart.map((item) => (
                          <div key={item.id} className="flex border-b pb-4">
                            <div className="w-20 h-20 rounded overflow-hidden mr-4">
                              {getProductImage(item.image)}
                            </div>
                            
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-indigo-600 font-bold">€{item.price.toFixed(2)}</p>
                              
                              <div className="flex items-center mt-2">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="p-1 rounded-full border"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="p-1 rounded-full border"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                                
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-auto text-red-500"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                          <span>Subtotal</span>
                          <span className="font-bold">€{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span>Envío</span>
                          <span className="font-bold">Gratis</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold mb-6">
                          <span>Total</span>
                          <span>€{subtotal.toFixed(2)}</span>
                        </div>
                        
                        <Button 
                          onClick={checkout}
                          className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                          Finalizar Compra
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                      <h4 className="text-xl font-medium mb-2">Tu carrito está vacío</h4>
                      <p className="text-gray-500 mb-6">Añade algunos productos para comenzar</p>
                      <Button 
                        onClick={() => setShowCart(false)}
                        variant="outline"
                      >
                        Continuar Comprando
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ExampleEcommerce;