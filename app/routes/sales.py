from flask import Blueprint, jsonify, request
import json
import os

sales_bp = Blueprint('sales', __name__)

SALES_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../database/sales.json'))

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

    return jsonify(sales), 200
