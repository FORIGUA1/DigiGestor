import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Cloud, CloudRain, Sun, CloudLightning, Wind, Droplets, Thermometer } from "lucide-react";

const ExampleWeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Datos de ejemplo para simular una API del clima
  const weatherData = {
    "Madrid": {
      temp: 28,
      condition: "sunny",
      humidity: 45,
      wind: 12,
      forecast: [
        { day: "Lun", temp: 28, condition: "sunny" },
        { day: "Mar", temp: 30, condition: "sunny" },
        { day: "Mié", temp: 29, condition: "partly-cloudy" },
        { day: "Jue", temp: 27, condition: "cloudy" },
        { day: "Vie", temp: 26, condition: "rainy" },
      ]
    },
    "Barcelona": {
      temp: 25,
      condition: "partly-cloudy",
      humidity: 60,
      wind: 15,
      forecast: [
        { day: "Lun", temp: 25, condition: "partly-cloudy" },
        { day: "Mar", temp: 26, condition: "partly-cloudy" },
        { day: "Mié", temp: 24, condition: "rainy" },
        { day: "Jue", temp: 23, condition: "rainy" },
        { day: "Vie", temp: 25, condition: "partly-cloudy" },
      ]
    },
    "Valencia": {
      temp: 30,
      condition: "sunny",
      humidity: 50,
      wind: 8,
      forecast: [
        { day: "Lun", temp: 30, condition: "sunny" },
        { day: "Mar", temp: 31, condition: "sunny" },
        { day: "Mié", temp: 32, condition: "sunny" },
        { day: "Jue", temp: 30, condition: "partly-cloudy" },
        { day: "Vie", temp: 29, condition: "partly-cloudy" },
      ]
    },
    "Sevilla": {
      temp: 35,
      condition: "sunny",
      humidity: 35,
      wind: 10,
      forecast: [
        { day: "Lun", temp: 35, condition: "sunny" },
        { day: "Mar", temp: 36, condition: "sunny" },
        { day: "Mié", temp: 37, condition: "sunny" },
        { day: "Jue", temp: 35, condition: "sunny" },
        { day: "Vie", temp: 34, condition: "partly-cloudy" },
      ]
    },
    "Bilbao": {
      temp: 22,
      condition: "rainy",
      humidity: 75,
      wind: 20,
      forecast: [
        { day: "Lun", temp: 22, condition: "rainy" },
        { day: "Mar", temp: 20, condition: "rainy" },
        { day: "Mié", temp: 21, condition: "cloudy" },
        { day: "Jue", temp: 23, condition: "partly-cloudy" },
        { day: "Vie", temp: 24, condition: "partly-cloudy" },
      ]
    }
  };

  const searchWeather = () => {
    if (city.trim() === "") {
      toast({
        title: "Error",
        description: "Por favor, introduce una ciudad",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulamos una llamada a API
    setTimeout(() => {
      const cityData = weatherData[city] || weatherData[Object.keys(weatherData)[0]];
      
      if (cityData) {
        setWeather({
          city: city || Object.keys(weatherData)[0],
          ...cityData
        });
        setLoading(false);
      } else {
        toast({
          title: "Ciudad no encontrada",
          description: "Prueba con: Madrid, Barcelona, Valencia, Sevilla o Bilbao",
          variant: "destructive",
        });
        setLoading(false);
      }
    }, 1000);
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-8 w-8 text-amber-500" />;
      case "partly-cloudy":
        return <Cloud className="h-8 w-8 text-gray-400" />;
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-600" />;
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case "stormy":
        return <CloudLightning className="h-8 w-8 text-purple-500" />;
      default:
        return <Cloud className="h-8 w-8 text-gray-400" />;
    }
  };

  const getWeatherGradient = (condition) => {
    switch (condition) {
      case "sunny":
        return "from-amber-400 to-orange-500";
      case "partly-cloudy":
        return "from-blue-300 to-gray-400";
      case "cloudy":
        return "from-gray-400 to-gray-600";
      case "rainy":
        return "from-blue-400 to-blue-600";
      case "stormy":
        return "from-purple-500 to-indigo-700";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  // Cargar datos de ejemplo al inicio
  React.useEffect(() => {
    setWeather({
      city: "Madrid",
      ...weatherData["Madrid"]
    });
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">Aplicación del Clima</h2>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Buscar ciudad..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && searchWeather()}
              list="cities"
            />
            <datalist id="cities">
              <option value="Madrid" />
              <option value="Barcelona" />
              <option value="Valencia" />
              <option value="Sevilla" />
              <option value="Bilbao" />
            </datalist>
            
            <Button 
              onClick={searchWeather} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Search size={18} />
              )}
            </Button>
          </div>
        </div>

        {weather && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`col-span-1 md:col-span-2 rounded-lg shadow-lg overflow-hidden`}
            >
              <div className={`bg-gradient-to-r ${getWeatherGradient(weather.condition)} p-6 text-white`}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-bold mb-1">{weather.city}</h3>
                    <p className="text-xl opacity-90">Hoy</p>
                  </div>
                  <div className="text-6xl font-bold">{weather.temp}°</div>
                </div>
                
                <div className="flex items-center mt-6">
                  {getWeatherIcon(weather.condition)}
                  <span className="ml-2 capitalize">
                    {weather.condition === "sunny" ? "Soleado" : 
                     weather.condition === "partly-cloudy" ? "Parcialmente nublado" :
                     weather.condition === "cloudy" ? "Nublado" :
                     weather.condition === "rainy" ? "Lluvioso" : 
                     weather.condition === "stormy" ? "Tormentoso" : ""}
                  </span>
                </div>
              </div>
              
              <div className="p-6 bg-white">
                <h4 className="text-lg font-semibold mb-4">Pronóstico de 5 días</h4>
                <div className="grid grid-cols-5 gap-2">
                  {weather.forecast.map((day, index) => (
                    <div key={index} className="text-center">
                      <p className="font-medium">{day.day}</p>
                      <div className="my-2 flex justify-center">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <p className="font-bold">{day.temp}°</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h4 className="text-lg font-semibold mb-4">Detalles</h4>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Thermometer className="h-6 w-6 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Temperatura</p>
                    <p className="font-medium">{weather.temp}°C</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Droplets className="h-6 w-6 text-blue-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Humedad</p>
                    <p className="font-medium">{weather.humidity}%</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Wind className="h-6 w-6 text-teal-500 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Viento</p>
                    <p className="font-medium">{weather.wind} km/h</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-lg font-semibold mb-4">Consejos</h4>
                <p className="text-gray-600">
                  {weather.condition === "sunny" ? 
                    "Día perfecto para actividades al aire libre. No olvides usar protector solar." : 
                   weather.condition === "rainy" ? 
                    "No olvides llevar paraguas y evita las zonas con riesgo de inundación." :
                   weather.condition === "stormy" ? 
                    "Se recomienda permanecer en interiores y evitar actividades al aire libre." :
                    "Buen día para actividades al aire libre. Lleva una chaqueta ligera por si acaso."}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ExampleWeatherApp;