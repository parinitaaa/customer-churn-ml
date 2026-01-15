from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Load model and feature columns
model = joblib.load("model/churn_model.pkl")
feature_columns = joblib.load("model/feature_columns.pkl")

def prepare_input(data):
    """
    Convert user input JSON into model-ready dataframe
    """
   
    input_df = pd.DataFrame(
        np.zeros((1, len(feature_columns))),
        columns=feature_columns
    )

   
    input_df["tenure"] = data["tenure"]
    input_df["MonthlyCharges"] = data["monthlyCharges"]
    input_df["TotalCharges"] = data["totalCharges"]

    
    if data["contract"] == "One year":
        input_df["Contract_One year"] = 1
    elif data["contract"] == "Two year":
        input_df["Contract_Two year"] = 1

   
    if data["internetService"] == "Fiber optic":
        input_df["InternetService_Fiber optic"] = 1
    elif data["internetService"] == "No":
        input_df["InternetService_No"] = 1


    if data["paymentMethod"] == "Electronic check":
        input_df["PaymentMethod_Electronic check"] = 1


    if data["onlineSecurity"] == "Yes":
        input_df["OnlineSecurity_Yes"] = 1


    if data["paperlessBilling"] == "Yes":
        input_df["PaperlessBilling_Yes"] = 1

    return input_df

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    input_df = prepare_input(data)
    churn_prob = model.predict_proba(input_df)[0][1]

    # Binary decision
    will_churn = bool(churn_prob >= 0.5)

    # Risk label
    risk = (
        "High" if churn_prob > 0.6 else
        "Medium" if churn_prob > 0.3 else
        "Low"
    )

    # Human-readable sentence
    if will_churn:
        message = "The customer is likely to leave the service :( "
    else:
        message = "The customer is likely to stay with the service :)"

    return jsonify({
        "churn_probability": round(float(churn_prob), 3),
        "will_churn": will_churn,
        "risk_level": risk,
        "message": message
    })


if __name__ == "__main__":
    app.run(debug=True)
