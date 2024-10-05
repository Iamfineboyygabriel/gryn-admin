import { PieChart, Pie, Cell } from 'recharts';

const PieChartEnquiries = () => {
  const pieData = [
    { name: 'Instagram', value: 121799, color: '#FFB800' },
    { name: 'Facebook', value: 66734, color: '#660066' },
    { name: 'LinkedIn', value: 21567, color: '#00A76F' },
    { name: 'TikTok', value: 11387, color: '#1ABCFE' },
    { name: 'Twitter', value: 11387, color: '#55ACEE' },
    { name: 'Youtube', value: 11387, color: '#FF0000' },
    { name: 'Others', value: 7806, color: '#FF3B30' }
  ];

  const totalViews = pieData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Enquiries</h2>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">July</span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="#667085" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="w-1/2">
          <PieChart width={300} height={300}>
            <Pie
              data={pieData}
              cx={150}
              cy={150}
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div className="w-1/2">
          <div className="mb-4">
            <p className="text-gray-500">Social Media</p>
            <p className="font-bold text-2xl">{totalViews.toLocaleString()} <span className="text-sm font-normal">views</span></p>
            <p className="text-green-600">34% <span className="text-sm">(+20,904)</span></p>
          </div>
          {pieData.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span style={{ color: item.color }}>{item.name}</span>
              <div className="flex items-center space-x-2">
                <span>{item.value.toLocaleString()}</span>
                <button className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartEnquiries;