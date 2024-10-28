import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const ApexChart: React.FC = () => {
  const series: ApexAxisChartSeries = [{
    name: 'Applications',
    data: [10, 20, 15, 25, 30, 35, 40, 45, 30, 25, 20, 15]
  }];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: {
        show: false
      },
      background: '#ffffff'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#660066'] 
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 80, 90],
        colorStops: [
          {
            offset: 0,
            color: '#8b5cf6',
            opacity: 0.4
          },
          {
            offset: 100,
            color: '#8b5cf6',
            opacity: 0.1
          }
        ]
      }
    },
    xaxis: {
      type: 'category',
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      }
    },
    grid: {
      show: true,
      borderColor: '#660066"',
      strokeDashArray: 4,
      position: 'back'
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      }
    },
    legend: {
      show: false
    }
  };

  return (
    <div className="apex-chart-container" style={{backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'}}>
    <div className="flex justify-between items-center">
      <h1 className='font-semibold text-lg'>Insights</h1>
      <div className='flex gap-[1.5em]'>
        <div className='px-[1em] rounded-md py-[2px] border-[1px] border-gray-500 text-primary-700'>Application</div>
        <div className='px-[1em] rounded-md py-[2px] border-[1px] border-gray-500 text-primary-700'>Completed</div>
      </div>
    </div>
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default ApexChart;