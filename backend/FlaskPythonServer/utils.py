import numpy as np
from sklearn.ensemble import RandomForestRegressor

def train_random_forest(X, y):
    model = RandomForestRegressor()
    model.fit(X, y)
    return model
