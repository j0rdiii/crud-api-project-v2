from flask import Blueprint, jsonify, request
import json
import os

sales_bp = Blueprint('sales', __name__)

SALES_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/sales.json'))
DB_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/db.json'))

def read_file(file_path):
    if not os.path.exists(file_path):
        return []
    with open(file_path, 'r') as f:
        return json.load(f)

def read_sales_db():
    if not os.path.exists(SALES_FILE):
        return []
    with open(SALES_FILE, 'r') as f:
        return json.load(f)

@sales_bp.route('/sales', methods=['GET'])
def get_sales():
    country = request.args.get('country')  # Obtener el parámetro 'country' de la URL
    model = request.args.get('model')  # Obtener el parámetro 'model' de la URL
    year = request.args.get('year')  # Obtener el parámetro 'year' de la URL
    page = int(request.args.get('page', 1))  # Página actual (por defecto 1)
    limit = int(request.args.get('limit', 1000))  # Límite de registros por página (por defecto 5)
    sales = read_sales_db()

    # Filtrar por país, modelo y/o año si se proporcionan
    if country:
        sales = [sale for sale in sales if sale['country'].lower() == country.lower()]
    if model:
        sales = [sale for sale in sales if sale['model'].lower() == model.lower()]
    if year:
        try:
            year = int(year)
            sales = [sale for sale in sales if sale['year'] == year]
        except ValueError:
            return jsonify({'error': 'Year must be a numeric value'}), 400

    # Implementar paginación
    start = (page - 1) * limit
    end = start + limit
    paginated_sales = sales[start:end]

    return jsonify({
        "data": paginated_sales,
        "total": len(sales),
        "page": page,
        "limit": limit
    }), 200

@sales_bp.route('/sales/annual', methods=['GET'])
def get_annual_sales():
    sales = read_file(SALES_FILE)
    cars = read_file(DB_FILE)

    # Combinar datos de ventas y coches
    annual_sales = {}
    for sale in sales:
        year = sale['year']
        units = sale['units_sold']
        annual_sales[year] = annual_sales.get(year, 0) + units

    for car in cars:
        year = car['year']
        annual_sales[year] = annual_sales.get(year, 0)

    # Formatear los datos para el frontend
    formatted_sales = [{"year": year, "total_units": units} for year, units in sorted(annual_sales.items())]

    return jsonify(formatted_sales), 200
