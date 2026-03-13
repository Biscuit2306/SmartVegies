import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/home.css";

const TraceabilityDetail = () => {
  const { batchId } = useParams();
  const [batch, setBatch] = useState(null);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/trace/${batchId}`);
        setBatch(res.data);
      } catch (err) {
        console.error("Batch not found");
      }
    };
    fetchBatch();
  }, [batchId]);

  if (!batch) return <div className="trace-container">Loading origin story...</div>;

  return (
    <div className="trace-container">
      <div className="trace-card">
        <h2 className="trace-header">{batch.vegetableName} <span className="verified-badge">✓ Verified</span></h2>
        <div className="trace-details">
          <p><strong>Farmer:</strong> {batch.farmer.name}</p>
          <p><strong>Farm:</strong> {batch.farmer.farmName}</p>
          <p><strong>Location:</strong> {batch.origin}</p>
          <p><strong>Harvested On:</strong> {new Date(batch.harvestDate).toLocaleDateString()}</p>
        </div>
        <p className="trace-description">{batch.description}</p>
      </div>
    </div>
  );
};

export default TraceabilityDetail;