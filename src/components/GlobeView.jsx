import { useRef, useEffect, useMemo } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';
import { arcData, airportPoints } from '../data/mockFlights';

export default function GlobeView({ timeLapse }) {
  const globeRef = useRef();

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = timeLapse ? 3.0 : 0.3;
    controls.enableZoom = true;
    controls.minDistance = 200;
    controls.maxDistance = 500;

    globeRef.current.pointOfView({ lat: 20, lng: 100, altitude: 2.5 }, 1000);
  }, []);

  useEffect(() => {
    if (!globeRef.current) return;
    const controls = globeRef.current.controls();
    controls.autoRotateSpeed = timeLapse ? 3.0 : 0.3;
  }, [timeLapse]);

  const arcs = useMemo(() => arcData, []);
  const points = useMemo(() => airportPoints, []);

  const globeMaterial = useMemo(() => {
    const material = new THREE.MeshPhongMaterial();
    material.color = new THREE.Color('#0a0e1a');
    material.emissive = new THREE.Color('#020408');
    material.emissiveIntensity = 0.6;
    material.shininess = 5;
    return material;
  }, []);

  return (
    <div className="globe-container">
      <Globe
        ref={globeRef}
        globeMaterial={globeMaterial}
        backgroundColor="rgba(0,0,0,0)"
        atmosphereColor="#00b4ff"
        atmosphereAltitude={0.2}
        showGraticules={true}
        arcsData={arcs}
        arcStartLat={d => d.startLat}
        arcStartLng={d => d.startLng}
        arcEndLat={d => d.endLat}
        arcEndLng={d => d.endLng}
        arcColor={d => d.color}
        arcStroke={d => d.stroke}
        arcDashLength={d => d.dashLength}
        arcDashGap={d => d.dashGap}
        arcDashAnimateTime={d => timeLapse ? d.dashAnimateTime / 3 : d.dashAnimateTime}
        arcAltitudeAutoScale={0.4}
        arcsTransitionDuration={500}
        pointsData={points}
        pointLat={d => d.lat}
        pointLng={d => d.lng}
        pointColor={() => 'rgba(0, 229, 255, 0.9)'}
        pointRadius={d => d.size}
        pointAltitude={0.01}
        pointsMerge={true}
        labelsData={points}
        labelLat={d => d.lat}
        labelLng={d => d.lng}
        labelText={d => d.code}
        labelSize={0.8}
        labelDotRadius={0.3}
        labelColor={() => 'rgba(240, 240, 240, 0.7)'}
        labelResolution={2}
        labelAltitude={0.015}
      />
    </div>
  );
}
