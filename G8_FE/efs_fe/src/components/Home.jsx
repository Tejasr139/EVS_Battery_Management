import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [batteriesData, setBatteriesData] = useState({});
  const [loading, setLoading] = useState(true);



  const handleBatteryClick = (batteryId) => {
    navigate(`/battery/${batteryId}`);
  };

  const getBatteryIcon = (soc) => {
    if (soc >= 80) return 'fas fa-battery-full';
    if (soc >= 60) return 'fas fa-battery-three-quarters';
    if (soc >= 40) return 'fas fa-battery-half';
    if (soc >= 20) return 'fas fa-battery-quarter';
    return 'fas fa-battery-empty';
  };

  const getBatteryColor = (soc) => {
    if (soc >= 80) return 'success';
    if (soc >= 40) return 'warning';
    return 'danger';
  };

  const fetchBatteriesData = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/battery/all');
      if (response.ok) {
        const data = await response.json();
        const batteryMap = {};
        
        ['BATT-000', 'BATT-001', 'BATT-002'].forEach(batteryId => {
          const batteryRecords = data.filter(item => item.batteryId === batteryId);
          if (batteryRecords.length > 0) {
            const latest = batteryRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
            batteryMap[batteryId] = latest;
          }
        });
        
        setBatteriesData(batteryMap);
      }
    } catch (error) {
      console.error('Error fetching batteries data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatteriesData();
    const interval = setInterval(fetchBatteriesData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header>
        <h3 className="mb-4">Battery Management System</h3>
      </header>
      {loading ? (
        <section className="d-flex justify-content-center">
          <article className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </article>
        </section>
      ) : (
        <section className="row g-4 justify-content-center">
          {['BATT-000', 'BATT-001', 'BATT-002'].map(batteryId => {
            const battery = batteriesData[batteryId];
            const soc = battery ? Math.round(battery.soc) : 0;
            const color = getBatteryColor(soc);
            const icon = getBatteryIcon(soc);
            const status = battery ? (battery.charging ? 'Charging' : 'Active') : 'Offline';
            const lastUpdate = battery ? new Date(battery.timestamp).toLocaleTimeString() : 'N/A';
            
            return (
              <article key={batteryId} className="col-md-4">
                <section className="card h-100 shadow-sm" style={{cursor: 'pointer'}} onClick={() => handleBatteryClick(batteryId)}>
                  <header className="card-body text-center">
                    <figure className="mb-3">
                      <i className={`${icon} text-${color}`} style={{fontSize: '4rem'}}></i>
                    </figure>
                    <h5 className="card-title">Battery {batteryId}</h5>
                    <p className="card-text">Status: {status}</p>
                    <span className={`badge bg-${color} mb-2`}>{soc}% Charged</span>
                    <time className="text-muted small d-block">Last Updated: {lastUpdate}</time>
                  </header>
                </section>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
};

export default Home;