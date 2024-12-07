import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { Select, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminApplicationStatsBar } from '../../../../../../shared/redux/admin/slices/application.slices';
import { AppDispatch } from '../../../../../../shared/redux/store';

const BarChat = () => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedDays, setSelectedDays] = useState(7); 
  const barChartStats = useSelector((state:any) => state?.application?.getBarChatStats);

  useEffect(() => {
    dispatch(getAdminApplicationStatsBar({ days: selectedDays }));
  }, [dispatch, selectedDays]);

  const processData = () => {
    if (!barChartStats?.length) {
      return [
        { day: 'Mon', applications: 0 },
        { day: 'Tue', applications: 0 },
        { day: 'Wed', applications: 0 },
        { day: 'Thu', applications: 0 },
        { day: 'Fri', applications: 0 },
        { day: 'Sat', applications: 0 },
        { day: 'Sun', applications: 0 },
      ];
    }

    return barChartStats?.map((item:any) => ({
      day: item?.day?.slice(0, 3), 
      applications: item?.count
    }));
  };

  return (
    <main className="font-outfit">
      <div className="flex px-3 justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-grey-primary">
          Registration Status
        </h1>
        <Select
          value={selectedDays}
          onChange={(e:any) => setSelectedDays(e.target.value)}
          size="small"
          className="mx-2"
        >
          <MenuItem value={7}>Last 7 days</MenuItem>
          <MenuItem value={30}>Last 30 days</MenuItem>
          <MenuItem value={90}>Last 90 days</MenuItem>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={processData()} 
          margin={{ top: 20, right: 20, left: 10, bottom: 30 }}
        >
          <XAxis dataKey="day">
            <Label 
              value="Days of the Week" 
              offset={0} 
              position="bottom" 
              style={{ marginTop: "20px" }} 
            />
          </XAxis>
          <YAxis>
            <Label 
              value="Number of Applications" 
              angle={-90} 
              position="insideLeft" 
              style={{ textAnchor: 'middle' }} 
            />
          </YAxis>
          <Tooltip />
          <Bar dataKey="applications" fill="#660066" />
        </BarChart>
      </ResponsiveContainer>
    </main>
  );
};

export default BarChat;