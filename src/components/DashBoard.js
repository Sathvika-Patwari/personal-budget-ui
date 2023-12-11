import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Chart } from "chart.js/auto";
import axios from "axios";

const DashBoard = () => {
  const { id } = useParams();
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [notification, setNotification] = useState("");
  const [selectedTitles, setSelectedTitles] = useState([]);
  const [budgetData, setBudgetData] = useState({
    labels: [],
    datasets: [{ year: [], month: [], data: [], backgroundColor: [] }],
  });
  const [originalData, setOriginalData] = useState({
    labels: [],
    datasets: [{ year: [], month: [], data: [], backgroundColor: [] }],
  });
  useEffect(() => {
    
    const notificationTimeout = setTimeout(() => {
      setNotification("New data loaded for the selected month.");
    }, 3000); 
    return () => clearTimeout(notificationTimeout);
  }, [budgetData, originalData, selectedTitles]);
  useEffect(() => {
    const fetchDataAndRenderCharts = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const response = await axios.get(
          `http://localhost:3001/api/budget/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = {
          labels: response.data.map((item) => item.title),
          datasets: [
            {
              label: "Budget Analysis",
              data: response.data.map((item) => item.budget),
              year: response.data.map((item) => item.year),
              month: response.data.map((item) => item.month),
              backgroundColor: response.data.map((item) => item.color),
              tension: 0.1,
            },
          ],
        };

        setOriginalData(data);
        setBudgetData(data);
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };

    fetchDataAndRenderCharts();
  }, [id]);

  useEffect(() => {
    renderCharts(selectedYear, selectedMonth, selectedTitle);
  }, [selectedYear, selectedMonth, selectedTitle, originalData]);

  const handleTitleToggle = (title) => {
    if (selectedTitles.includes(title)) {
      // If title is already in selectedTitles, remove it
      setSelectedTitles((prevTitles) => prevTitles.filter((t) => t !== title));
    } else {
      // If title is not in selectedTitles, add it
      setSelectedTitles((prevTitles) => [...prevTitles, title]);
    }
  };

  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
  };

  const renderCharts = (year, month, title) => {
    let filteredData = originalData;

    // Apply title filter
    if (title) {
      filteredData = {
        labels: originalData.labels,
        datasets: [
          {
            data: originalData.datasets[0].data.map((_, index) =>
              originalData.labels[index] === title
                ? originalData.datasets[0].data[index]
                : 0
            ),
            year: originalData.datasets[0].year,
            month: originalData.datasets[0].month,
            backgroundColor: originalData.datasets[0].backgroundColor,
            tension: 0.1,
          },
        ],
      };
    }

    // Apply month filter
    if (month) {
      filteredData = {
        labels: originalData.labels,
        datasets: [
          {
            data: originalData.labels.map((label, index) =>
              originalData.datasets[0].month[index] === month
                ? originalData.datasets[0].data[index]
                : 0
            ),
            year: originalData.datasets[0].year,
            month: originalData.datasets[0].month,
            backgroundColor: originalData.datasets[0].backgroundColor,
            tension: 0.1,
          },
        ],
      };
    }

    // Apply year filter
    if (year) {
      filteredData = {
        labels: originalData.labels,
        datasets: [
          {
            data: originalData.labels.map((label, index) =>
              originalData.datasets[0].year[index] === year
                ? originalData.datasets[0].data[index]
                : 0
            ),
            year: originalData.datasets[0].year,
            month: originalData.datasets[0].month,
            backgroundColor: originalData.datasets[0].backgroundColor,
            tension: 0.1,
          },
        ],
      };
    }

    setBudgetData(filteredData);
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/";
  };

  const destroyChart = (canvas) => {
    const existingChart = Chart.getChart(canvas);
    if (existingChart) {
      existingChart.destroy();
    }
  };

  useEffect(() => {
    renderBarChart("BarChart", originalData, selectedMonth);
    renderLineChart("lineChart", originalData, selectedTitles);
    renderPieChart("PieChart", originalData);
    renderDoughnutChart("DoughnutChart", originalData);
    renderRadarChart("RadarChart", originalData);
    renderPolarAreaChart("PolarAreaChart", originalData);
    renderBubbleChart("BubbleChart", budgetData);
    renderScatterChart("ScatterChart", originalData);
    renderMixedChart("MixedChart", budgetData);
  }, [budgetData, originalData, selectedTitles]);

  const renderBarChart = (canvasId, originalData, selectedMonth) => {
    const barChartCanvas = document.getElementById(canvasId);
    destroyChart(barChartCanvas);

    // Filter unique labels based on the selected month
    const uniqueLabels = originalData.labels.filter((label, index) => {
      return originalData.datasets[0].month[index] === selectedMonth;
    });

    // Filter the dataset based on the selected month and unique labels
    const filteredData = {
      labels: uniqueLabels,
      datasets: [
        {
          label: "Budget Analysis",
          data: uniqueLabels.map((label) => {
            const index = originalData.labels.indexOf(label);
            return originalData.datasets[0].data[index];
          }),
          backgroundColor: originalData.datasets[0].backgroundColor,
          tension: 0.1,
        },
      ],
    };

    new Chart(barChartCanvas, {
      type: "bar",
      data: filteredData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: [
            {
              title: {
                display: true,
                text: `Budget Analysis for ${selectedMonth}`, // Display selected month in x-axis title
              },
              grid: {
                display: true,
              },
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          y: {
            title: {
              display: true,
              text: "Budget",
            },
          },
        },
      },
    });
  };

  const renderLineChart = (canvasId, originalData, selectedTitles) => {
    const lineChartCanvas = document.getElementById(canvasId);
    destroyChart(lineChartCanvas);

    // Filter the dataset based on the selected titles
    const filteredData = {
      labels: selectedTitles,
      datasets: [
        {
          data: selectedTitles.map((title) => {
            const index = originalData.labels.indexOf(title);
            return originalData.datasets[0].data[index];
          }),
          backgroundColor: originalData.datasets[0].backgroundColor,
          borderWidth: 2, 
          fill: false,
          tension: 0.1,
        },
      ],
    };

    new Chart(lineChartCanvas, {
      type: "line",
      data: filteredData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Title",
            },
          },
          y: {
            title: {
              display: true,
              text: "Budget",
            },
          },
        },
      },
    });
  };

  const renderPieChart = (canvasId, data) => {
    const pieChartCanvas = document.getElementById(canvasId);
    destroyChart(pieChartCanvas);

    const monthlyExpenses = originalData.labels.reduce((acc, label, index) => {
      const month = originalData.datasets[0].month[index];
      acc[month] =
        (acc[month] || 0) + parseFloat(originalData.datasets[0].data[index]);
      return acc;
    }, {});
    const pieData = {
      labels: Object.keys(monthlyExpenses),
      datasets: [
        {
          data: Object.values(monthlyExpenses),
          backgroundColor: Object.values(
            originalData.datasets[0].backgroundColor
          ),
        },
      ],
    };

    new Chart(pieChartCanvas, {
      type: "pie",
      data: pieData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  const renderDoughnutChart = (canvasId, data) => {
    const doughnutChartCanvas = document.getElementById(canvasId);
    destroyChart(doughnutChartCanvas);

    new Chart(doughnutChartCanvas, {
      type: "doughnut",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  const renderRadarChart = (canvasId, data) => {
    const radarChartCanvas = document.getElementById(canvasId);
    destroyChart(radarChartCanvas);

    new Chart(radarChartCanvas, {
      type: "radar",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  const renderPolarAreaChart = (canvasId, data) => {
    const polarAreaChartCanvas = document.getElementById(canvasId);
    destroyChart(polarAreaChartCanvas);

    new Chart(polarAreaChartCanvas, {
      type: "polarArea",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  };

  const renderBubbleChart = (canvasId, originalData) => {
    const bubbleChartCanvas = document.getElementById(canvasId);
    destroyChart(bubbleChartCanvas);

    const bubbleData = {
      labels: originalData.labels,
      datasets: [
        {
          data: originalData.labels.map((label, index) => ({
            x: originalData.datasets[0].month[index], // Use x-axis for month
            y: originalData.datasets[0].data[index],
            r: 10, // Set the radius for the "bubble"
          })),
          backgroundColor: originalData.datasets[0].backgroundColor,
        },
      ],
    };

    new Chart(bubbleChartCanvas, {
      type: "scatter", // Use scatter chart for bubble-like charts
      data: bubbleData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Month",
            },
          },
          y: {
            title: {
              display: true,
              text: "Budget",
            },
          },
        },
      },
    });
  };

  const renderScatterChart = (canvasId, data) => {
    const scatterChartCanvas = document.getElementById(canvasId);
    destroyChart(scatterChartCanvas);

    new Chart(scatterChartCanvas, {
      type: "scatter",
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Title",
            },
          },
          y: {
            title: {
              display: true,
              text: "Budget",
            },
          },
        },
      },
    });
  };

  const renderMixedChart = (canvasId, budgetData) => {
    const mixedChartCanvas = document.getElementById(canvasId);
    destroyChart(mixedChartCanvas);

    new Chart(mixedChartCanvas, {
      type: "bar",
      data: budgetData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Title",
            },
          },
          y: {
            title: {
              display: true,
              text: "Budget",
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    });
  };

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to={`/dash/${id}`}>Home</Link>
          </li>
          <li>
            <Link to={`/expenses/${id}`}>Configure Expenses</Link>
          </li>
          <li>
            <span onClick={handleSignOut} className="sign-out-button">
              SignOut
            </span>
          </li>
        </ul>
      </nav>

      <center>
        <h1>Welcome to the Dashboard</h1>
        <div role="region" aria-labelledby="barChartHeading">
        <h3 id="barChartHeading">Budget Analysis - Bar Chart</h3>
          <div>
          <label htmlFor="selectMonth">Select Month:</label>
            <select id="selectMonth" onChange={(e) => handleMonthSelect(e.target.value)} aria-label="Select Month">
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div style={{ height: "80vh", width: "80vw" }}>
            <canvas id="BarChart" aria-label="Bar Chart"></canvas>
          </div>

          <br />

          <center>
            <h3>Budget Analysis</h3>
            {selectedMonth && (
              <>
                <h4>Expenses in {selectedMonth}</h4>
                {originalData.labels
                  .filter(
                    (_, index) =>
                      originalData.datasets[0].month[index] === selectedMonth
                  )
                  .map((title) => (
                    <label key={title}>
                      <input
                        type="checkbox"
                        checked={selectedTitles.includes(title)}
                        onChange={() => handleTitleToggle(title)}
                        aria-label={`Toggle ${title} data`}
                      />
                      {title}
                    </label>
                  ))}
              </>
            )}
            <div style={{ height: "80vh", width: "80vw" }}>
              <canvas id="lineChart"></canvas>
            </div>
          </center>
        </div>
        <br />

        <center>
          <h3>Budget Analysis - Pie Chart</h3>
          <div style={{ height: "80vh", width: "80vw" }}>
            <canvas id="PieChart"></canvas>
          </div>
        </center>
        <h3>Doughnut Chart</h3>
        <div style={{ height: "80vh", width: "80vw" }}>
          <canvas id="DoughnutChart"></canvas>
        </div>

        <h3>Radar Chart</h3>
        <div style={{ height: "80vh", width: "80vw" }}>
          <canvas id="RadarChart"></canvas>
        </div>

        <h3>Polar Area Chart</h3>
        <div style={{ height: "80vh", width: "80vw" }}>
          <canvas id="PolarAreaChart"></canvas>
        </div>

        <h2>Mixed Chart</h2>
        <div style={{ height: "80vh", width: "80vw" }}>
          <canvas id="MixedChart"></canvas>
        </div>
      </center>
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{color:"gray", position: "fixed", top: 0, left: 0, zIndex: 100 }}
      >
        {notification && <div>{notification}</div>}
      </div>
    </div>
  );
};

export default DashBoard;
