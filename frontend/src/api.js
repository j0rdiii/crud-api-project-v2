// src/api.js
const API_URL = '';

export const getCars = async () => {
    const res = await fetch('/cars');
    return await res.json();
  };
  
  export const createCar = async (car) => {
    await fetch('/cars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    });
  };
  
  export const updateCar = async (index, car) => {
    console.log('Datos enviados al backend:', car); // Agregar este log
    await fetch(`/cars/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(car),
    });
  };
  
  export const deleteCar = async (index) => {
    await fetch(`/cars/${index}`, { method: 'DELETE' });
  };

  export async function getSales({ model, country, year, page = 1 }) {
    const params = new URLSearchParams();
  
    if (model) params.append("model", model);
    if (country) params.append("country", country);
    if (year) params.append("year", year);
    if (page) params.append("page", page);
  
    const response = await fetch(`/sales?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Error al obtener ventas");
    }
    return response.json();
  }
  
