class Sale:
    def __init__(self, year, model, country, units_sold):
        self.year = year
        self.model = model
        self.country = country
        self.units_sold = units_sold

    def to_dict(self):
        return {
            "year": self.year,
            "model": self.model,
            "country": self.country,
            "units_sold": self.units_sold
        }
