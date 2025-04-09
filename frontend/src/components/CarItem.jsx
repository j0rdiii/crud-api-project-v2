import { Edit, Trash2 } from 'lucide-react';

export default function CarItem({ car, index, onEdit, onDelete }) {
  return (
    <div className="card car-card shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          {car.make} {car.model}
          <span className="badge bg-secondary ms-2">{car.year}</span>
        </h5>

        <p className="card-text features-preview">
          <strong>Características:</strong> {car.features.join(', ')}
        </p>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit(car, index)}>
            <Edit/> Editar
          </button>
          <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(index)}>
            <Trash2/> Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
