import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    tenure: "",
    monthlyCharges: "",
    totalCharges: "",
    contract: "Month-to-month",
    internetService: "Fiber optic",
    paymentMethod: "Electronic check",
    onlineSecurity: "No",
    paperlessBilling: "Yes",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tenure: Number(formData.tenure),
          monthlyCharges: Number(formData.monthlyCharges),
          totalCharges: Number(formData.totalCharges),
          contract: formData.contract,
          internetService: formData.internetService,
          paymentMethod: formData.paymentMethod,
          onlineSecurity: formData.onlineSecurity,
          paperlessBilling: formData.paperlessBilling,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Prediction error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Customer Churn Predictor</h1>

     <form onSubmit={handleSubmit} className="form">

  <div className="field">
    <label>Tenure (months)</label>
    <input
      type="number"
      name="tenure"
      value={formData.tenure}
      onChange={handleChange}
      required
    />
  </div>

  <div className="field">
    <label>Monthly Charges</label>
    <input
      type="number"
      name="monthlyCharges"
      value={formData.monthlyCharges}
      onChange={handleChange}
      required
    />
  </div>

  <div className="field">
    <label>Total Charges</label>
    <input
      type="number"
      name="totalCharges"
      value={formData.totalCharges}
      onChange={handleChange}
      required
    />
  </div>

  <div className="field">
    <label>Contract Type</label>
    <select name="contract" value={formData.contract} onChange={handleChange}>
      <option>Month-to-month</option>
      <option>One year</option>
      <option>Two year</option>
    </select>
  </div>

  <div className="field">
    <label>Internet Service</label>
    <select
      name="internetService"
      value={formData.internetService}
      onChange={handleChange}
    >
      <option>DSL</option>
      <option>Fiber optic</option>
      <option>No</option>
    </select>
  </div>

  <div className="field">
    <label>Payment Method</label>
    <select
      name="paymentMethod"
      value={formData.paymentMethod}
      onChange={handleChange}
    >
      <option>Electronic check</option>
      <option>Mailed check</option>
      <option>Bank transfer (automatic)</option>
      <option>Credit card (automatic)</option>
    </select>
  </div>

  <div className="field">
    <label>Online Security</label>
    <select
      name="onlineSecurity"
      value={formData.onlineSecurity}
      onChange={handleChange}
    >
      <option>Yes</option>
      <option>No</option>
    </select>
  </div>

  <div className="field">
    <label>Paperless Billing</label>
    <select
      name="paperlessBilling"
      value={formData.paperlessBilling}
      onChange={handleChange}
    >
      <option>Yes</option>
      <option>No</option>
    </select>
  </div>

  <button type="submit">
    {loading ? "Predicting..." : "Predict Churn"}
  </button>

</form>


      {result && (
        <div className="result">
          <h2>Prediction Result</h2>
          <p><strong>Churn Probability:</strong> {result.churn_probability}</p>
          <p><strong>Risk Level:</strong> {result.risk_level}</p>
          <p><strong>Decision:</strong> {result.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
