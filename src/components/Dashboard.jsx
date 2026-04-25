import AIAgentInput from './AIAgentInput';
import AircraftTelemetry from './AircraftTelemetry';
import FlightSchedule from './FlightSchedule';
import ContingencyPlan from './ContingencyPlan';
import CarbonFootprint from './CarbonFootprint';
import TopBar from './TopBar';

export default function Dashboard({ timeLapse, onTimeLapseToggle }) {
  return (
    <div className="dashboard-overlay">
      <TopBar timeLapse={timeLapse} onTimeLapseToggle={onTimeLapseToggle} />

      <div className="left-panel">
        <AIAgentInput />
        <AircraftTelemetry />
      </div>

      <div className="center-panel" />

      <div className="right-panel">
        <FlightSchedule />
        <ContingencyPlan />
        <CarbonFootprint />
      </div>
    </div>
  );
}
