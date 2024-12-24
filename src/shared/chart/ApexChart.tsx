import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { getAdminApexChartStats } from "../redux/admin/slices/application.slices";

interface DayData {
  day: string;
  count: number;
}

interface ChartResponse {
  status: number;
  message: string;
  data: DayData[];
}

const ApexChart = () => {
  const dispatch: AppDispatch = useDispatch();
  const chartStats = useSelector(
    (state: RootState) => state.application.getApexChatStats
  ) as ChartResponse;
  const [selectedStatus, setSelectedStatus] = useState("SUBMITTED");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const statusOptions = ["COMPLETED", "SUBMITTED", "DECLINED"];
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", { month: "long" }),
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );

  useEffect(() => {
    dispatch(
      getAdminApexChartStats({
        month: selectedMonth,
        year: selectedYear,
        status: selectedStatus,
      }) as any
    );
  }, [dispatch, selectedMonth, selectedYear, selectedStatus]);

  const processData = () => {
    if (!chartStats?.data) {
      return [0, 0, 0, 0, 0, 0, 0];
    }

    const daysOrder = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const orderedData = daysOrder.map((day) => {
      const dayData = chartStats.data.find((d) => d.day === day);
      return dayData ? dayData.count : 0;
    });

    return orderedData;
  };

  const series = [
    {
      name: "Applications",
      data: processData(),
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false,
      },
      background: "#ffffff",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#660066"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 80, 90],
        colorStops: [
          {
            offset: 0,
            color: "#8b5cf6",
            opacity: 0.4,
          },
          {
            offset: 100,
            color: "#8b5cf6",
            opacity: 0.1,
          },
        ],
      },
    },
    xaxis: {
      type: "category",
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontFamily: "outfit",
        },
      },
      title: {
        text: "Days of the Week",
        style: {
          fontSize: "14px",
          color: "#660066",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#660066",
          fontSize: "12px",
        },
      },
      title: {
        text: "Number of Applications",
        style: {
          fontSize: "14px",
          color: "#660066",
        },
      },
    },
    grid: {
      show: true,
      borderColor: "#660066",
      strokeDashArray: 4,
      position: "back",
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between md:flex-nowrap">
        <h1 className="mb-2 text-lg font-semibold md:mb-0">Insights</h1>

        <div className="flex w-full flex-wrap items-center gap-4 md:w-auto md:flex-nowrap">
          <select
            className="w-full rounded-md border border-gray-500 px-3 py-1.5 text-sm text-primary-700 md:w-auto"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-md border border-gray-500 px-3 py-1.5 text-sm text-primary-700 md:w-auto"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <select
            className="w-full rounded-md border border-gray-500 px-3 py-1.5 text-sm text-primary-700 md:w-auto"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 md:mt-0 md:gap-6">
          <div className="rounded-md border border-gray-500 px-4 py-0.5 text-primary-700">
            Applications (
            {chartStats?.data?.reduce((acc, curr) => acc + curr.count, 0) ?? 0})
          </div>
          <div className="rounded-md border border-gray-500 px-4 py-0.5 text-primary-700">
            {selectedStatus} (
            {chartStats?.data?.reduce((acc, curr) => acc + curr?.count, 0) ?? 0}
            )
          </div>
        </div>
      </div>

      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default ApexChart;
