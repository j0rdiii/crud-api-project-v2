import CarItem from './CarItem';

export default function CarList({ cars, onEdit, onDelete }) {
  return (
    <div className="car-grid animate-fade-up">
      {[...cars].reverse().map((car, index) => (
        <CarItem
          key={car.id}
          car={car}
          index={index}
          onEdit={onEdit}
          onDelete={() => onDelete(car.id)} // Cambiar aquí
        />
      ))}
    </div>
  );
}
