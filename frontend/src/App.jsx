import { Search, Car, PlusCircle, ArrowLeft } from 'lucide-react';
import CarForm from './components/CarForm';
import CarList from './components/CarList';
import { useEffect, useState, useRef } from 'react';
import { createCar, updateCar, deleteCar } from './api';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [cars, setCars] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const searchTimeout = useRef(null);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async (model = '') => {
    try {
      const query = model ? `?model=${model}` : '';
      const res = await fetch(`/cars${query}`);
      const data = await res.json();
      setCars(data);
    } catch (error) {
      console.error('Error cargando coches:', error);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    setIsSearching(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      loadCars(text).then(() => {
        setIsSearching(false);
      });
    }, 1000);
  };

  const handleCreate = async (car) => {
    if (editIndex !== null) {
      await updateCar(car.id, car);
      setEditIndex(null);
    } else {
      await createCar(car);
    }
    setEditingCar(null);
    setShowForm(false);
    loadCars(search);
  };

  const handleEdit = (car, index) => {
    setEditingCar(car);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres borrar este coche?');
    if (!confirmed) return;

    await deleteCar(id);
    loadCars(search); // Recargar la lista de coches después de eliminar
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top animate-slide-in-top">
        <div className="container-fluid px-4 d-flex justify-content-between align-items-center position-relative">

          {/* Izquierda: Título + icono */}
          <div className="d-flex align-items-center">
            <Car className="me-2 text-primary" size={24} />
            <span className="fw-bold text-primary fs-5">Tu Garaje Virtual</span>
          </div>

          {/* Centro absoluto: Buscador */}
          {!showForm && (
            <form
              className="position-absolute start-50 translate-middle-x animate-fade-up"
              style={{ width: '700px', zIndex: 1 }}
            >
              <div className="input-group shadow-sm">
                <span className="input-group-text bg-light">
                  <Search />
                </span>
                <input
                  type="text"
                  className="form-control form-control-lg fw-semibold"
                  style={{ height: '56px', fontSize: '1.1rem' }}
                  placeholder="Buscar por modelo..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {isSearching && (
                  <div className="d-flex align-items-center ms-3 animate-fade-in" style={{ animationDuration: '0.4s' }}>
                    <div className="spinner-border text-primary me-2" role="status">
                      <span className="visually-hidden">Buscando...</span>
                    </div>
                    <span className="text-primary fw-medium">Buscando coches...</span>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* Derecha: Botón dinámico */}
          <div className="d-flex animate-pop">
            {showForm ? (
              <button
                className="btn btn-outline-secondary d-flex align-items-center"
                onClick={() => setShowForm(false)}
              >
                <ArrowLeft className="me-2" />
                Volver a búsqueda
              </button>
            ) : (
              <button
                className="btn btn-primary d-flex align-items-center justify-content-center"
                onClick={() => {
                  setEditingCar(null);
                  setShowForm(true);
                }}
                style={{ width: "42px", height: "42px", padding: 0 }}
              >
                <PlusCircle size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>
      {/* Contenido */}
      <div className="content-container mt-5 pt-4 animate-fade-up">
        {showForm ? (
          <div className="form-container animate-bounce">
            <CarForm onSubmit={handleCreate} editingCar={editingCar} />
          </div>
        ) : (
          <div className="animate-fade-up">
            <CarList cars={cars} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
