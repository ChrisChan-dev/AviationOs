export const flightRoutes = [
  {
    id: 'PR112',
    airline: 'Philippine Airlines',
    callsign: 'PAL112',
    departure: { code: 'MNL', name: 'Manila', lat: 14.5086, lng: 121.0194, time: '08:30', terminal: 'T2' },
    arrival: { code: 'LAX', name: 'Los Angeles', lat: 33.9425, lng: -118.4081, time: '06:45', terminal: 'TBIT' },
    status: 'En Route',
    statusColor: 'cyan',
    aircraft: 'A350-900',
    flightTime: '13h 15m',
    distance: 11974,
    progress: 0.62
  },
  {
    id: 'SQ321',
    airline: 'Singapore Airlines',
    callsign: 'SIA321',
    departure: { code: 'SIN', name: 'Singapore', lat: 1.3644, lng: 103.9915, time: '10:15', terminal: 'T3' },
    arrival: { code: 'LHR', name: 'London Heathrow', lat: 51.4700, lng: -0.4543, time: '16:30', terminal: 'T2' },
    status: 'On Time',
    statusColor: 'cyan',
    aircraft: 'A380-800',
    flightTime: '13h 15m',
    distance: 10841,
    progress: 0
  },
  {
    id: 'EK215',
    airline: 'Emirates',
    callsign: 'UAE215',
    departure: { code: 'DXB', name: 'Dubai', lat: 25.2532, lng: 55.3657, time: '03:40', terminal: 'T3' },
    arrival: { code: 'JFK', name: 'New York JFK', lat: 40.6413, lng: -73.7781, time: '09:10', terminal: 'T4' },
    status: 'Delayed',
    statusColor: 'amber',
    aircraft: 'B777-300ER',
    flightTime: '14h 30m',
    distance: 11023,
    progress: 0
  },
  {
    id: 'QF1',
    airline: 'Qantas',
    callsign: 'QFA1',
    departure: { code: 'SYD', name: 'Sydney', lat: -33.9461, lng: 151.1772, time: '16:00', terminal: 'T1' },
    arrival: { code: 'DXB', name: 'Dubai', lat: 25.2532, lng: 55.3657, time: '22:45', terminal: 'T3' },
    status: 'Boarding',
    statusColor: 'green',
    aircraft: 'A380-800',
    flightTime: '14h 45m',
    distance: 12045,
    progress: 0
  }
];

export const arcData = flightRoutes.map(route => ({
  startLat: route.departure.lat,
  startLng: route.departure.lng,
  endLat: route.arrival.lat,
  endLng: route.arrival.lng,
  color: route.statusColor === 'amber' ? ['rgba(255,171,0,0.8)', 'rgba(255,171,0,0.2)'] : route.statusColor === 'green' ? ['rgba(0,230,118,0.8)', 'rgba(0,230,118,0.2)'] : ['rgba(0,229,255,0.8)', 'rgba(0,229,255,0.2)'],
  stroke: route.id === 'PR112' ? 2.5 : 1.2,
  dashLength: route.progress > 0 ? 0.4 : 0.6,
  dashGap: route.progress > 0 ? 0.2 : 0.3,
  dashAnimateTime: route.progress > 0 ? 2000 : 4000,
  label: `${route.id}: ${route.departure.code} → ${route.arrival.code}`,
  flightId: route.id
}));

export const airportPoints = flightRoutes.reduce((points, route) => {
  const depKey = route.departure.code;
  const arrKey = route.arrival.code;
  if (!points.find(p => p.code === depKey)) {
    points.push({ code: depKey, name: route.departure.name, lat: route.departure.lat, lng: route.departure.lng, size: 0.5 });
  }
  if (!points.find(p => p.code === arrKey)) {
    points.push({ code: arrKey, name: route.arrival.name, lat: route.arrival.lat, lng: route.arrival.lng, size: 0.5 });
  }
  return points;
}, []);

export const telemetryData = {
  altitude: { value: 38000, unit: 'ft', trend: [35000, 36200, 37100, 37800, 38000] },
  groundSpeed: { value: 487, unit: 'kts', trend: [472, 480, 485, 490, 487] },
  machNumber: { value: 0.84, unit: 'M', trend: [0.82, 0.83, 0.84, 0.84, 0.84] },
  heading: { value: 52, unit: '°', trend: [48, 50, 51, 52, 52] },
  verticalSpeed: { value: 0, unit: 'ft/min' },
  windSpeed: { value: 45, unit: 'kts' },
  windDirection: { value: 270, unit: '°' },
  oat: { value: -56, unit: '°C' }
};

export const carbonData = {
  flightId: 'PR112',
  totalCO2: 142.8,
  perPassenger: 0.285,
  distance: 11974,
  fuelBurn: 45200,
  efficiency: 3.78,
  comparison: {
    thisRoute: 0.285,
    average: 0.32,
    bestInClass: 0.24
  }
};

export const contingencyRoutes = [
  {
    label: 'Option A — Via Tokyo NRT',
    path: 'MNL → NRT → LAX',
    addedTime: '+3h 20m',
    reason: 'Avoids Pacific typhoon corridor',
    fuelImpact: '+8,200 kg',
    costImpact: '+$12,400'
  },
  {
    label: 'Option B — Via Honolulu HNL',
    path: 'MNL → HNL → LAX',
    addedTime: '+2h 05m',
    reason: 'Refuel stop, favorable winds',
    fuelImpact: '+5,100 kg',
    costImpact: '+$7,800'
  }
];

export const weatherAlerts = [
  { type: 'SIGMET', region: 'North Pacific', severity: 'moderate', description: 'Severe turbulence FL350-FL410', active: true },
  { type: 'NOTAM', region: 'LAX', severity: 'low', description: 'RWY 25L closed for maintenance 0600-0800Z', active: true }
];
