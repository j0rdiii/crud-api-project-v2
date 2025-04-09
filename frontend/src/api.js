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
