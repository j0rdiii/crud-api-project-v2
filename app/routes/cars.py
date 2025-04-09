from flask import Blueprint, jsonify, request
import json
import os
import re

cars_bp = Blueprint('cars', __name__)

DB_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/db.json'))

def ensure_db_exists():
    if not os.path.exists(DB_FILE):
        os.makedirs(os.path.dirname(DB_FILE), exist_ok=True)
        with open(DB_FILE, 'w') as f:
            json.dump([], f, indent=4)  # Inicializar con una lista vacía

def read_db():
    ensure_db_exists()
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def write_db(data):
    ensure_db_exists()
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

def validate_car_data(car_data, cars):
    for car in cars:
        # Excluir el coche actual (si tiene el mismo ID)
        if car.get('id') == car_data.get('id'):
            continue

        if car['model'] == car_data['model'] and car['year'] == car_data['year']:
            return "Car with the same model and year already exists."

        # Modelo: empieza con mayúscula y permite letras, números, espacios y guiones
        if not re.match(r'^[A-Za-z][A-Za-z0-9\s\-]*$', car_data['make']):
            return "Make must start with a letter and contain only letters, numbers, spaces or hyphens."

        # Marca: igual que modelo
        if not re.match(r'^[A-Za-z][A-Za-z0-9\s\-]*$', car_data['model']):
            return "Model must start with a letter and contain only letters, numbers, spaces or hyphens."

        # Año debe ser número
        if not isinstance(car_data['year'], int):
            return "Year must be a numeric value."

    return None

@cars_bp.route('/cars', methods=['GET'])
def get_cars():
    model = request.args.get('model')  # Obtener el parámetro 'model' de la URL
    cars = read_db()
    if model:
        # Filtrar coches cuyo modelo contenga el texto proporcionado (sin distinción de mayúsculas/minúsculas)
        cars = [
            car for car in cars
            if any(word.lower().startswith(model.lower()) for word in car.get('model', '').split())
        ]
    return jsonify(cars), 200

@cars_bp.route('/cars', methods=['POST'])
def create_car():
    new_car = request.json
    cars = read_db()

    # Asignar un id incremental
    new_car['id'] = max([car['id'] for car in cars], default=0) + 1

    # Validar los datos del coche
    error = validate_car_data(new_car, cars)
    if error:
        return jsonify({'error': error}), 400

    cars.append(new_car)
    write_db(cars)
    return jsonify(new_car), 201

@cars_bp.route('/cars/<int:car_id>', methods=['PUT'])
def update_car(car_id):
    updated_car = request.json
    cars = read_db()

    # Validar que el coche exista
    if not any(car['id'] == car_id for car in cars):
        return jsonify({'error': 'Car not found'}), 404

    # Excluir el coche actual antes de validar
    other_cars = [car for car in cars if car['id'] != car_id]

    # Validar los datos del coche
    error = validate_car_data(updated_car, other_cars)
    if error:
        return jsonify({'error': error}), 400

    # Actualizar el coche
    for car in cars:
        if car['id'] == car_id:
            car.update(updated_car)
            break

    write_db(cars)
    return jsonify(updated_car), 200

@cars_bp.route('/cars/<int:car_id>', methods=['DELETE'])
def delete_car(car_id):
    cars = read_db()
    car_to_delete = next((car for car in cars if car['id'] == car_id), None)

    if car_to_delete:
        cars.remove(car_to_delete)
        write_db(cars)
        return jsonify(car_to_delete), 200

    return jsonify({'error': 'Car not found'}), 404