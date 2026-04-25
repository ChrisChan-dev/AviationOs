import { useState } from 'react';
import GlobeView from './components/GlobeView';
import Dashboard from './components/Dashboard';

export default function App() {
  const [timeLapse, setTimeLapse] = useState(false);

  return (
    <>
      <GlobeView timeLapse={timeLapse} />
      <Dashboard
        timeLapse={timeLapse}
        onTimeLapseToggle={() => setTimeLapse(prev => !prev)}
      />
    </>
  );
}
