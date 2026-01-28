// Initialize all charts on the page
document.addEventListener('DOMContentLoaded', function() {
    // Register Chart.js plugins
    Chart.register({
        id: 'customTooltip',
        afterDraw: function(chart) {
            // Custom tooltip styling
        }
    });
    
    // Chart 1: Class Distribution Pie Chart
    const classDistributionCtx = document.getElementById('classDistributionChart').getContext('2d');
    const classDistributionChart = new Chart(classDistributionCtx, {
        type: 'doughnut',
        data: chartData.classDistribution,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        family: "'Poppins', sans-serif"
                    },
                    bodyFont: {
                        family: "'Poppins', sans-serif"
                    },
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '60%',
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 2000
            }
        }
    });
    
    // Chart 2: Transaction Amount Distribution
    const amountDistributionCtx = document.getElementById('amountDistributionChart').getContext('2d');
    const amountDistributionChart = new Chart(amountDistributionCtx, {
        type: 'bar',
        data: chartData.amountDistribution,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: €${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (€)',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return '€' + value;
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Transaction Type',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
    
    // Chart 3: Time Distribution of Transactions
    const timeDistributionCtx = document.getElementById('timeDistributionChart').getContext('2d');
    const timeDistributionChart = new Chart(timeDistributionCtx, {
        type: 'line',
        data: chartData.timeDistribution,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Transactions',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Hour of Day',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14
                        }
                    },
                    ticks: {
                        maxTicksLimit: 12
                    }
                }
            },
            elements: {
                point: {
                    radius: 3,
                    hoverRadius: 6
                },
                line: {
                    tension: 0.3
                }
            }
        }
    });
    
    // Chart 4: Statistical Comparison Bar Chart
    const statComparisonCtx = document.getElementById('statComparisonChart').getContext('2d');
    const statComparisonChart = new Chart(statComparisonCtx, {
        type: 'bar',
        data: chartData.statComparison,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: €${context.raw.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount (€)',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return '€' + value;
                        }
                    }
                }
            }
        }
    });
    
    // Chart 5: PCA Component Importance
    const pcaImportanceCtx = document.getElementById('pcaImportanceChart').getContext('2d');
    const pcaImportanceChart = new Chart(pcaImportanceCtx, {
        type: 'bar',
        data: chartData.pcaImportance,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Variance: ${(context.raw * 100).toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Variance Explained',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14
                        }
                    },
                    ticks: {
                        callback: function(value) {
                            return (value * 100).toFixed(0) + '%';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'PCA Components',
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 14
                        }
                    }
                }
            }
        }
    });
    
    // Chart 6: Correlation Heatmap
    const correlationHeatmapCtx = document.getElementById('correlationHeatmap').getContext('2d');
    
    // Process correlation data for heatmap
    const correlationLabels = chartData.correlationHeatmap.labels;
    const correlationDatasets = chartData.correlationHeatmap.datasets;
    
    // Create data matrix for heatmap
    const correlationData = {
        labels: correlationLabels,
        datasets: correlationDatasets.map((dataset, i) => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: function(context) {
                const value = context.raw;
                let alpha = Math.abs(value) * 0.8;
                if (value > 0) {
                    return `rgba(46, 204, 113, ${alpha})`;
                } else if (value < 0) {
                    return `rgba(231, 76, 60, ${alpha})`;
                } else {
                    return 'rgba(200, 200, 200, 0.3)';
                }
            },
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1
        }))
    };
    
    const correlationHeatmap = new Chart(correlationHeatmapCtx, {
        type: 'matrix',
        data: correlationData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            const row = context[0].row;
                            const column = context[0].column;
                            return `${correlationLabels[row]} vs ${correlationLabels[column]}`;
                        },
                        label: function(context) {
                            const value = context.raw;
                            return `Correlation: ${value.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Store charts for interactivity
    window.charts = {
        classDistribution: classDistributionChart,
        amountDistribution: amountDistributionChart,
        timeDistribution: timeDistributionChart,
        statComparison: statComparisonChart,
        pcaImportance: pcaImportanceChart,
        correlationHeatmap: correlationHeatmap
    };
    
    // Add chart interactivity controls
    setupChartControls();
});

// Function to set up chart controls
function setupChartControls() {
    // Add toggle functionality for charts
    const toggleChartsBtn = document.getElementById('toggleChartsBtn');
    if (toggleChartsBtn) {
        toggleChartsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const chartsSection = document.querySelector('.visualizations');
            if (chartsSection.style.display === 'none') {
                chartsSection.style.display = 'block';
                this.innerHTML = '<i class="fas fa-chart-line"></i> Hide Charts';
            } else {
                chartsSection.style.display = 'none';
                this.innerHTML = '<i class="fas fa-chart-line"></i> Show Charts';
            }
        });
    }
    
    // Add chart type toggle for amount distribution
    const amountChartTypeBtn = document.createElement('button');
    amountChartTypeBtn.className = 'control-btn';
    amountChartTypeBtn.textContent = 'Switch to Line Chart';
    amountChartTypeBtn.addEventListener('click', function() {
        const chart = window.charts.amountDistribution;
        if (chart.config.type === 'bar') {
            chart.config.type = 'line';
            this.textContent = 'Switch to Bar Chart';
        } else {
            chart.config.type = 'bar';
            this.textContent = 'Switch to Line Chart';
        }
        chart.update();
    });
    
    // Insert button after amount distribution chart
    const amountChartContainer = document.querySelector('#amountDistributionChart').closest('.chart-card');
    if (amountChartContainer) {
        const chartBox = amountChartContainer.querySelector('.chart-box');
        chartBox.parentNode.insertBefore(amountChartTypeBtn, chartBox.nextSibling);
    }
    
    // Add data filter for time distribution
    const timeChartFilter = document.createElement('div');
    timeChartFilter.className = 'chart-controls';
    timeChartFilter.innerHTML = `
        <button class="control-btn active" data-filter="all">All Transactions</button>
        <button class="control-btn" data-filter="normal">Normal Only</button>
        <button class="control-btn" data-filter="fraud">Fraud Only</button>
    `;
    
    timeChartFilter.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON') {
            // Update active button
            timeChartFilter.querySelectorAll('.control-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Filter data
            const filter = e.target.dataset.filter;
            const chart = window.charts.timeDistribution;
            
            if (filter === 'normal') {
                chart.data.datasets[0].hidden = false;
                chart.data.datasets[1].hidden = true;
            } else if (filter === 'fraud') {
                chart.data.datasets[0].hidden = true;
                chart.data.datasets[1].hidden = false;
            } else {
                chart.data.datasets[0].hidden = false;
                chart.data.datasets[1].hidden = false;
            }
            
            chart.update();
        }
    });
    
    // Insert filter after time distribution chart
    const timeChartContainer = document.querySelector('#timeDistributionChart').closest('.chart-card');
    if (timeChartContainer) {
        const chartBox = timeChartContainer.querySelector('.chart-box');
        chartBox.parentNode.insertBefore(timeChartFilter, chartBox.nextSibling);
    }
}