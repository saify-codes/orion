import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score



df = pd.read_csv("/home/saify/Desktop/Projects/Angular/orion/AI/datatsets/ford.csv")

X_Train, X_Test, Y_Train, Y_Test = train_test_split(df[['mileage', 'year', 'engineSize']], df['price'], test_size=0.2, random_state=42)

model = LinearRegression()
model.fit(X_Train, Y_Train)
Y_Pred = model.predict(X_Test)

print("Coefficient: ", model.coef_)
print("Intercept: ", model.intercept_)
print("r2 score: ", r2_score(Y_Test, Y_Pred))
