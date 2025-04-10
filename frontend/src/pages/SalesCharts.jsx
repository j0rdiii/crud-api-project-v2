import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalesDetail({ initialViewAnnualSales = false }) {
  const { model } = useParams();
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewAnnualSales, setViewAnnualSales] = useState(initialViewAnnualSales); // Usar el estado inicial
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const [models, setModels] = useState([]); // Lista de modelos disponibles
  const [selectedModel, setSelectedModel] = useState(model || ''); // Modelo seleccionado

  useEffect(() => {
    if (viewAnnualSales) {
      fetchAnnualSales();
    } else if (selectedModel) {
      fetchModelSales(selectedModel);
    }
  }, [viewAnnualSales, selectedModel]);

  useEffect(() => {
    fetchAvailableModels();
  }, []);

  const fetchModelSales = async (model) => {
    try {
      setLoading(true);
      const res = await fetch(`/sales?model=${model}`);
      const data = await res.json();
      setSales(data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar ventas del modelo:', error);
      setLoading(false);
    }
  };

  const fetchAnnualSales = async () => {
    try {
      setLoading(true);
      const res = await fetch('/sales/annual');
      const data = await res.json();
      setSales(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar ventas anuales:', error);
      setLoading(false);
    }
  };

  const fetchAvailableModels = async () => {
    try {
      const res = await fetch('/cars');
      const data = await res.json();
      const uniqueModels = [...new Set(data.data.map((car) => car.model))];
      setModels(uniqueModels);
    } catch (error) {
      console.error('Error al cargar modelos disponibles:', error);
    }
  };

  const handleModelSelection = (model) => {
    setSelectedModel(model);
    setViewAnnualSales(false);
    setShowModal(false);
  };

  const chartData = {
    labels: sales.map((s) => (viewAnnualSales ? s.year : `${s.country} (${s.year})`)),
    datasets: [
      {
        label: viewAnnualSales ? 'Unidades Vendidas por Año' : `Unidades vendidas de ${selectedModel}`,
        data: sales.map((s) => (viewAnnualSales ? s.total_units : s.units_sold)),
        backgroundColor: 'rgba(13, 110, 253, 0.7)',
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: viewAnnualSales ? 'Ventas Anuales' : `Ventas del modelo ${selectedModel}`,
      },
    },
  };

  return (
    <div className="container py-5 animate-fade-in">
      {/* Título + botones */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-3 mb-md-0">
          📊 {viewAnnualSales ? 'Ventas Anuales' : `Ventas de: ${selectedModel?.toUpperCase()}`}
        </h2>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary d-flex align-items-center shadow-sm hover-scale"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="me-2" size={18} />
            Volver al garaje
          </button>
          <button
            className={`btn ${viewAnnualSales ? 'btn-outline-success' : 'btn-outline-primary'} d-flex align-items-center shadow-sm hover-scale`}
            onClick={() => {
              if (viewAnnualSales) {
                setShowModal(true); // Mostrar modal para seleccionar modelo
              } else {
                setViewAnnualSales(true);
              }
            }}
          >
            {viewAnnualSales ? 'Ver Ventas por Modelo' : 'Ver Ventas Anuales'}
          </button>
        </div>
      </div>

      {/* Estado de carga */}
      {loading ? (
        <div className="text-center text-muted">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p>Cargando datos de ventas...</p>
        </div>
      ) : sales.length === 0 ? (
        // Sin ventas
        <div className="alert alert-warning text-center">
          No hay datos de ventas disponibles.
        </div>
      ) : (
        // Gráfico
        <div className="bg-white p-4 rounded shadow animate-fade-up">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}

      {/* Modal para seleccionar modelo */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Seleccionar Modelo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Elige un modelo para ver sus ventas:</p>
          <div className="list-group">
            {models.map((model) => (
              <button
                key={model}
                className="list-group-item list-group-item-action"
                onClick={() => handleModelSelection(model)}
              >
                {model}
              </button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
