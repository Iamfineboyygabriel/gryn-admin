import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { Select, MenuItem } from '@mui/material';

const data = [
  { day: 'Mon', applications: 16 },
  { day: 'Tue', applications: 13 },
  { day: 'Wed', applications: 20 },
  { day: 'Thu', applications: 5 },
  { day: 'Fri', applications: 16 },
  { day: 'Sat', applications: 18 },
  { day: 'Sun', applications: 10 },
];

const BarChat = () => {
  return (
    <main className="font-outfit">
      <div className="flex px-3 justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-grey-primary">
          Registration Status
        </h1>
        <Select
          value="Application"
          size="small"
        >
          <MenuItem value="Application">Application</MenuItem>
        </Select>
        <Select
          value="Last 7 Days"
          size="small"
        >
          <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 20, left:10, bottom: 30 }}>
          <XAxis dataKey="day">
            <Label value="Days of the Week" offset={0} position="bottom" style={{ marginTop: "20px" }} />
          </XAxis>
          <YAxis>
            <Label value="Number of Applications" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
          </YAxis>
          <Tooltip />
          <Bar dataKey="applications" fill="#660066" />
        </BarChart>
      </ResponsiveContainer>
    </main>
  );
};

export default BarChat;