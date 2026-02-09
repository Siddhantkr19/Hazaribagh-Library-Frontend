import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import adminApi from '../../services/adminApi';

const RevenueChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from our new endpoint
    const fetchData = async () => {
      try {
       const rawData = await adminApi.getRevenueGraphData();
        
        // Safety check: Ensure rawData is an array before mapping
        if (Array.isArray(rawData)) {
             const formattedData = rawData.map(item => ({
                name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: item.revenue
            }));
            setData(formattedData);
        }
      } catch (error) {
        console.error("Chart data error", error);
      }
    };
    fetchData();
  }, []);

  if (data.length === 0) {
    return (
        <div className="h-full flex items-center justify-center text-gray-500 text-sm">
            Not enough data to display graph yet.
        </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af" 
            tick={{fontSize: 12}} 
            axisLine={false} 
            tickLine={false}
          />
          <YAxis 
            stroke="#9ca3af" 
            tick={{fontSize: 12}} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
            itemStyle={{ color: '#60a5fa' }}
            formatter={(value) => [`₹${value}`, "Revenue"]}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;