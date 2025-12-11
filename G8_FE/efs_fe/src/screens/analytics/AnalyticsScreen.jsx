import { useState, useEffect, useRef } from 'react';
import '../../styles/analytics/analytics.css';

const ChartCanvas = ({ canvasRef, batteriesData, batteryColors }) => {
    const drawChart = (data) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const padding = 60;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, width, height);
        
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            const y = padding + (i * chartHeight / 10);
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
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 10; i++) {
            const value = 100 - (i * 10);
            const y = padding + (i * chartHeight / 10) + 4;
            ctx.fillText(value + '%', padding - 10, y);
        }
        
        Object.entries(data).forEach(([batteryId, records]) => {
            if (records.length === 0) return;
            
            ctx.strokeStyle = batteryColors[batteryId];
            ctx.lineWidth = 3;
            ctx.beginPath();
            
            records.forEach((record, index) => {
                const x = padding + (index * chartWidth / (records.length - 1));
                const y = height - padding - (record.soc / 100 * chartHeight);
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
            
            ctx.fillStyle = batteryColors[batteryId];
            records.forEach((record, index) => {
                const x = padding + (index * chartWidth / (records.length - 1));
                const y = height - padding - (record.soc / 100 * chartHeight);
                
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fill();
            });
        });
        
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Battery SoC Comparison', width / 2, 30);
        
        let legendY = 50;
        Object.entries(batteryColors).forEach(([batteryId, color]) => {
            ctx.fillStyle = color;
            ctx.fillRect(width - 150, legendY, 15, 15);
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(batteryId, width - 130, legendY + 12);
            legendY += 25;
        });
    };

    useEffect(() => {
        drawChart(batteriesData);
    }, [batteriesData]);

    return (
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={400} 
            style={{width: '100%', height: 'auto', maxHeight: '400px'}}
        />
    );
};

export const AnalyticsScreen = () => {
    const [batteriesData, setBatteriesData] = useState({});
    const [loading, setLoading] = useState(true);
    const canvasRef = useRef(null);

    const batteryColors = {
        'BATT-000': '#3498db',
        'BATT-001': '#e74c3c',
        'BATT-002': '#2ecc71'
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
                        const sortedRecords = batteryRecords.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                        batteryMap[batteryId] = sortedRecords.slice(-10);
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
        const interval = setInterval(fetchBatteriesData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <main className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                <section className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </section>
            </main>
        );
    }

    return (
        <main>
            <header className="mb-4">
                <h3>Battery Performance Analytics</h3>
                <p className="text-muted">Compare battery performance over time</p>
            </header>
            
            <section className="row">
                <article className="col-12">
                    <section className="card analytics-card">
                        <header className="card-header">
                            <h5 className="mb-0">SoC Comparison Chart</h5>
                        </header>
                        <main className="card-body">
                            <ChartCanvas 
                                canvasRef={canvasRef}
                                batteriesData={batteriesData}
                                batteryColors={batteryColors}
                            />
                        </main>
                    </section>
                </article>
            </section>
        </main>
    );
};