// Real-time Train GPS and Delay Simulation Service

const getSimulatedLiveStatus = (train, date) => {
  const route = train.route || [];
  if (route.length === 0) {
    return {
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      status: 'ON_TIME',
      delayMinutes: 0,
      currentStation: train.fromStationName,
      nextStation: train.toStationName,
      platform: 1,
      speedKmh: 110,
      lastUpdated: new Date()
    };
  }

  // Pick middle station as active station
  const activeIndex = Math.min(1, route.length - 1);
  const currentStation = route[activeIndex] || route[0];
  const nextStation = route[activeIndex + 1] || route[route.length - 1];

  const delays = [0, 0, 5, 10, 0, 2];
  const delayMinutes = delays[Math.floor(Math.random() * delays.length)];

  return {
    trainNumber: train.trainNumber,
    trainName: train.trainName,
    trainType: train.trainType,
    status: delayMinutes === 0 ? 'ON_TIME' : `DELAYED BY ${delayMinutes} MINS`,
    delayMinutes,
    currentStation: currentStation.stationName,
    currentStationCode: currentStation.stationCode,
    nextStation: nextStation.stationName,
    nextStationCode: nextStation.stationCode,
    platform: currentStation.platform || 2,
    speedKmh: 115,
    distanceCoveredKm: currentStation.distanceKm || 340,
    totalDistanceKm: route[route.length - 1].distanceKm || 1380,
    stationsTimeline: route.map((st, idx) => ({
      stationCode: st.stationCode,
      stationName: st.stationName,
      scheduledArrival: st.arrivalTime,
      scheduledDeparture: st.departureTime,
      actualArrival: st.arrivalTime,
      platform: st.platform,
      distanceKm: st.distanceKm,
      isPassed: idx <= activeIndex,
      isCurrent: idx === activeIndex
    })),
    lastUpdated: new Date()
  };
};

module.exports = { getSimulatedLiveStatus };