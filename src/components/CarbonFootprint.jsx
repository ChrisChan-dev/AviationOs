import { carbonData } from '../data/mockFlights';

export default function CarbonFootprint() {
  const maxVal = Math.max(
    carbonData.comparison.thisRoute,
    carbonData.comparison.average,
    carbonData.comparison.bestInClass
  );

  return (
    <div className="glass-card animate-in" id="carbon-panel">
      <div className="card-header">
        <span className="card-title">Carbon Footprint</span>
        <span className="card-badge green">PR112</span>
      </div>

      <div className="carbon-metrics">
        <div className="carbon-main">
          <div className="carbon-value">{carbonData.totalCO2}</div>
          <div className="carbon-unit">tonnes CO₂</div>
          <div className="carbon-sub-label">Total Flight Emissions</div>
        </div>

        <div className="carbon-details">
          <div className="carbon-detail-item">
            <div className="carbon-detail-label">Per Passenger</div>
            <div className="carbon-detail-value">{carbonData.perPassenger} t</div>
          </div>
          <div className="carbon-detail-item">
            <div className="carbon-detail-label">Distance</div>
            <div className="carbon-detail-value">{carbonData.distance.toLocaleString()} km</div>
          </div>
          <div className="carbon-detail-item">
            <div className="carbon-detail-label">Fuel Burn</div>
            <div className="carbon-detail-value">{carbonData.fuelBurn.toLocaleString()} kg</div>
          </div>
          <div className="carbon-detail-item">
            <div className="carbon-detail-label">Efficiency</div>
            <div className="carbon-detail-value">{carbonData.efficiency} L/100km</div>
          </div>
        </div>

        <div className="carbon-comparison">
          <div className="carbon-comparison-title">Route Comparison (t CO₂/pax)</div>

          <div className="carbon-bar-row">
            <span className="carbon-bar-label">This Route</span>
            <div className="carbon-bar-track">
              <div
                className="carbon-bar-fill this-route"
                style={{ width: `${(carbonData.comparison.thisRoute / maxVal) * 100}%` }}
              />
            </div>
            <span className="carbon-bar-val">{carbonData.comparison.thisRoute}</span>
          </div>

          <div className="carbon-bar-row">
            <span className="carbon-bar-label">Average</span>
            <div className="carbon-bar-track">
              <div
                className="carbon-bar-fill average"
                style={{ width: `${(carbonData.comparison.average / maxVal) * 100}%` }}
              />
            </div>
            <span className="carbon-bar-val">{carbonData.comparison.average}</span>
          </div>

          <div className="carbon-bar-row">
            <span className="carbon-bar-label">Best Class</span>
            <div className="carbon-bar-track">
              <div
                className="carbon-bar-fill best"
                style={{ width: `${(carbonData.comparison.bestInClass / maxVal) * 100}%` }}
              />
            </div>
            <span className="carbon-bar-val">{carbonData.comparison.bestInClass}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
