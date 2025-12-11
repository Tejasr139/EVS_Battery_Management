import { useState } from 'react';

const BatteryData = () => {

  const [selectedBattery, setSelectedBattery] = useState('BATT-000');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [metricsData, setMetricsData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMetricsData = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const startTime = new Date(startDate).toISOString().slice(0, -5);
      const endTime = new Date(endDate).toISOString().slice(0, -5);
      
      const response = await fetch(
        `http://localhost:8081/api/battery/${selectedBattery}/history?startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setMetricsData(data);
      } else {
        alert('Failed to fetch history data');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('Error fetching data');
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <header>
        <h3 className="mb-4">Battery History Analysis</h3>
      </header>
          
          {/* Controls */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">Data Selection</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Battery</label>
                  <select 
                    className="form-select" 
                    value={selectedBattery} 
                    onChange={(e) => setSelectedBattery(e.target.value)}
                  >
                    <option value="BATT-000">BATT-000</option>
                    <option value="BATT-001">BATT-001</option>
                    <option value="BATT-002">BATT-002</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Start Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="form-control" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">End Date & Time</label>
                  <input 
                    type="datetime-local" 
                    className="form-control" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                  <button 
                    className="btn btn-primary w-100" 
                    onClick={fetchMetricsData}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Fetch Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Data Table */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">History Data Table</h5>
            </div>
            <div className="card-body">
              {metricsData && metricsData.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Timestamp</th>
                        <th>SOC (%)</th>
                        <th>SOH (%)</th>
                        <th>Temperature (°C)</th>
                        <th>Charging Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metricsData.map((record, index) => (
                        <tr key={index}>
                          <td>{new Date(record.timestamp).toLocaleString()}</td>
                          <td>
                            <span className={`badge bg-${
                              record.soc >= 80 ? 'success' : 
                              record.soc >= 40 ? 'warning' : 'danger'
                            }`}>
                              {Math.round(record.soc)}%
                            </span>
                          </td>
                          <td>{Math.round(record.soh)}%</td>
                          <td>{Math.round(record.temperature)}°C</td>
                          <td>
                            <span className={`badge bg-${record.charging ? 'warning' : 'info'}`}>
                              {record.charging ? 'Charging' : 'Idle'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <i className="fas fa-table fs-1 mb-3"></i>
                  <p>Select battery and date range to view history data</p>
                </div>
              )}
            </div>
          </div>
    </>
  );
};

export default BatteryData;