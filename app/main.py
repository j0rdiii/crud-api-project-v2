from flask import Flask
from routes.cars import cars_bp

app = Flask(__name__)

app.register_blueprint(cars_bp, url_prefix='/')

if __name__ == '__main__':
    app.run(debug=True)