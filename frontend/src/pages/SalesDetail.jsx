import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function SalesDetail() {
  const { model } = useParams();
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`/sales?model=${model}`); // Cambiar a URL relativa
        const data = await res.json();
        console.log('Ventas recibidas:', data);
        setSales(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar ventas:', error);
        setLoading(false);
      }
    };      
    fetchSales();
  }, [model]);
  

  const chartData = {
    labels: sales.map(s => `${s.country} (${s.year})`),
    datasets: [{
      label: `Unidades vendidas de ${model}`,
      data: sales.map(s => s.units_sold),
      backgroundColor: 'rgba(13, 110, 253, 0.7)',
      borderRadius: 5,
    }]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Ventas del modelo ${model}`,
      },
    },
  };

  return (
    <div className="container py-5 animate-fade-in">
      {/* Título + botón volver */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h2 className="text-primary mb-3 mb-md-0">
          📊 Ventas de: <span className="text-dark">{model?.toUpperCase()}</span>
        </h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={() => navigate('/')}>
          <ArrowLeft className="me-2" size={18} />
          Volver al garaje
        </button>
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
          No hay datos de ventas registrados para este modelo.
        </div>
      ) : (
        // Gráfico
        <div className="bg-white p-4 rounded shadow animate-fade-up">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
  
}
