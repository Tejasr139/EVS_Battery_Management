import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import Sidebar from './Sidebar';

const BatteryDetails = () => {
  const { batteryId } = useParams();
  const { user, logout } = useSession();
  const [batteryData, setBatteryData] = useState(null);
  const [recentReadings, setRecentReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);

  const roundValue = (value) => Math.round(value * 10) / 10;

  const handleLogout = () => {
    logout();
  };

  const handleCharge60 = async () => {
    try {
      const response = await fetch(`/api/charge/60?batteryId=${batteryId}&currentSoc=60`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      if (response.ok) {
        alert('Charge to 60% initiated successfully');
        fetchBatteryData();
      } else {
        alert('Failed to initiate charge');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('CORS Error: Backend server needs to allow cross-origin requests');
    }
  };

  const handleCharge80 = async () => {
    try {
      const response = await fetch(`/api/charge/80?batteryId=${batteryId}&currentSoc=80`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      if (response.ok) {
        alert('Charge to 80% initiated successfully');
        fetchBatteryData();
      } else {
        alert('Failed to initiate charge');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('CORS Error: Backend server needs to allow cross-origin requests');
    }
  };

  const handleDischarge50 = async () => {
    try {
      const response = await fetch(`/api/discharge/50?batteryId=${batteryId}&currentSoc=${Math.round(batteryData.soc)}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      if (response.ok) {
        alert('Discharge to 50% initiated successfully');
        fetchBatteryData();
      } else {
        alert('Failed to initiate discharge');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('CORS Error: Backend server needs to allow cross-origin requests');
    }
  };

  const handleDischarge20 = async () => {
    try {
      const response = await fetch(`/api/discharge/20?batteryId=${batteryId}&currentSoc=${Math.round(batteryData.soc)}`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      if (response.ok) {
        alert('Discharge to 20% initiated successfully');
        fetchBatteryData();
      } else {
        alert('Failed to initiate discharge');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('CORS Error: Backend server needs to allow cross-origin requests');
    }
  };

  const drawChart = (data) => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const socValues = data.map(d => d.soc);
    const minSoc = Math.min(...socValues) - 5;
    const maxSoc = Math.max(...socValues) + 5;
    
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight / 5);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    if (data.length > 1) {
      ctx.strokeStyle = '#007bff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      data.forEach((point, index) => {
        const x = padding + (index * chartWidth / (data.length - 1));
        const y = height - padding - ((point.soc - minSoc) / (maxSoc - minSoc)) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.stroke();
      
      ctx.fillStyle = '#007bff';
      data.forEach((point, index) => {
        const x = padding + (index * chartWidth / (data.length - 1));
        const y = height - padding - ((point.soc - minSoc) / (maxSoc - minSoc)) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
    
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const value = maxSoc - (i * (maxSoc - minSoc) / 5);
      const y = padding + (i * chartHeight / 5) + 4;
      ctx.fillText(Math.round(value) + '%', padding - 10, y);
    }
    
    ctx.textAlign = 'center';
    ctx.font = '14px Arial';
    ctx.fillText('SOC Over Time', width / 2, 20);
  };

  const fetchBatteryData = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/battery/all');
      if (response.ok) {
        const data = await response.json();
        console.log('All battery data:', data);
        
        // Filter for the specific battery ID from URL params
        const batteryData = data.filter(item => {
          console.log('Checking item:', item.batteryId, 'against', batteryId);
          return item.batteryId === batteryId;
        });
        console.log(`${batteryId} records found:`, batteryData.length);
        console.log(`${batteryId} data:`, batteryData);
        
        if (batteryData.length > 0) {
          // Sort by timestamp descending
          const sortedData = batteryData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          const latestRecord = sortedData[0];
          console.log(`Latest ${batteryId} record being displayed:`, latestRecord);
          console.log('Battery ID of displayed record:', latestRecord.batteryId);
          setBatteryData(latestRecord);
          
          // Get latest 5 records
          const latest5Records = sortedData.slice(0, 5);
          console.log('Latest 5 records:', latest5Records);
          setRecentReadings(latest5Records);
          
          // Draw chart
          drawChart(latest5Records.reverse()); // Reverse to show oldest to newest
        } else {
          console.log('No battery data found at all');
          setBatteryData(null);
          setRecentReadings([]);
        }
      }
    } catch (error) {
      console.error('Error fetching battery data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchBatteryData();
    
    // Set up auto-refresh every 5 minutes (300000 ms)
    const interval = setInterval(fetchBatteryData, 10000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [batteryId]);

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  if (!batteryData) {
    return <div className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
      <div className="alert alert-warning">Battery data not found</div>
    </div>;
  }

  return (
    <div className="d-flex" style={{minHeight: '100vh'}}>
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1">
        <header className="bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Battery {batteryId} Details</h2>
          <div className="dropdown">
            <button className="btn btn-link text-dark" type="button" data-bs-toggle="dropdown">
              <i className="fas fa-user-circle fs-3"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><span className="dropdown-item-text fw-bold">{user.name}</span></li>
              <li><span className="dropdown-item-text text-muted">{user.role}</span></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </button></li>
            </ul>
          </div>
        </header>
        
        <main className="p-4">
          {/* Battery Status Cards */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">SOC</h5>
                  <h2 className="text-primary">{roundValue(batteryData.soc)}%</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">SOH</h5>
                  <h2 className="text-success">{roundValue(batteryData.soh)}%</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Temperature</h5>
                  <h2 className="text-danger">{roundValue(batteryData.temperature)}°C</h2>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">Status</h5>
                  <h2 className={batteryData.is_charging ? "text-warning" : "text-info"}>
                    {batteryData.is_charging ? "Charging" : "Idle"}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          {/* Charge Control Buttons */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">🔋 Charge Control</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6 className="text-center mb-3">⚡ Charge Controls</h6>
                      <div className="d-flex flex-column gap-2">
                        <button 
                          onClick={handleCharge60}
                          className="btn btn-warning px-4"
                          style={{borderRadius: '10px'}}
                        >
                          <i className="fas fa-bolt me-2"></i>
                          Charge to 60%
                        </button>
                        <button 
                          onClick={handleCharge80}
                          className="btn btn-success px-4"
                          style={{borderRadius: '10px'}}
                        >
                          <i className="fas fa-battery-three-quarters me-2"></i>
                          Charge to 80%
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="text-center mb-3">🔋 Discharge Controls</h6>
                      <div className="d-flex flex-column gap-2">
                        <button 
                          onClick={handleDischarge50}
                          className="btn btn-info px-4"
                          style={{borderRadius: '10px'}}
                        >
                          <i className="fas fa-arrow-down me-2"></i>
                          Discharge to 50%
                        </button>
                        <button 
                          onClick={handleDischarge20}
                          className="btn btn-danger px-4"
                          style={{borderRadius: '10px'}}
                        >
                          <i className="fas fa-battery-quarter me-2"></i>
                          Discharge to 20%
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Table */}
          <div className="row g-4">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Battery Performance Chart</h5>
                </div>
                <div className="card-body">
                  <canvas 
                    ref={canvasRef} 
                    width={600} 
                    height={300} 
                    style={{width: '100%', height: 'auto', maxHeight: '300px'}}
                  ></canvas>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Recent Readings</h5>
                </div>
                <div className="card-body">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentReadings.map((reading, index) => (
                        <tr key={index}>
                          <td>{new Date(reading.timestamp).toLocaleTimeString()}</td>
                          <td>{roundValue(reading.soc)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BatteryDetails;