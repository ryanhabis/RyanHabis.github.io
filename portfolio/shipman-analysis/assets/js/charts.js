// Initialize all charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
});

function initializeCharts() {
    // Chart 1: Time Distribution
    const timeCtx = document.getElementById('timeDistributionChart');
    if (timeCtx) {
        createTimeDistributionChart(timeCtx);
    }

    // Chart 2: Day of Week
    const dayCtx = document.getElementById('dayOfWeekChart');
    if (dayCtx) {
        createDayOfWeekChart(dayCtx);
    }

    // Chart 3: Seasonal Distribution
    const seasonCtx = document.getElementById('seasonalChart');
    if (seasonCtx) {
        createSeasonalChart(seasonCtx);
    }

    // Chart 4: Heatmap
    const heatmapCtx = document.getElementById('heatmapChart');
    if (heatmapCtx) {
        createHeatmapChart(heatmapCtx);
    }
}

function createTimeDistributionChart(ctx) {
    // Your actual data from analysis
    const data = {
        labels: [
            '8 AM', '9 AM', '10 AM', '11 AM', '12 PM',
            '1 PM', '2 PM', '3 PM', '4 PM', '5 PM',
            '6 PM', '7 PM', '8 PM'
        ],
        datasets: [{
            label: 'Number of Victims',
            data: [8, 12, 34, 27, 18, 12, 24, 19, 38, 14, 6, 2, 1],
            backgroundColor: 'rgba(37, 99, 235, 0.5)',
            borderColor: 'rgb(37, 99, 235)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} victims`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Victims'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Time of Day'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function createDayOfWeekChart(ctx) {
    const data = {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Number of Victims',
            data: [51, 24, 39, 42, 35, 19, 5],
            backgroundColor: [
                'rgba(37, 99, 235, 0.7)',
                'rgba(37, 99, 235, 0.6)',
                'rgba(37, 99, 235, 0.7)',
                'rgba(37, 99, 235, 0.8)',
                'rgba(37, 99, 235, 0.7)',
                'rgba(124, 58, 237, 0.5)',
                'rgba(124, 58, 237, 0.3)'
            ],
            borderColor: [
                'rgb(37, 99, 235)',
                'rgb(37, 99, 235)',
                'rgb(37, 99, 235)',
                'rgb(37, 99, 235)',
                'rgb(37, 99, 235)',
                'rgb(124, 58, 237)',
                'rgb(124, 58, 237)'
            ],
            borderWidth: 1
        }]
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
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
                            const percentage = ((context.parsed.y / 215) * 100).toFixed(1);
                            return `${context.parsed.y} victims (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    display: true,
                    color: '#ffffff',
                    font: {
                        weight: 'bold',
                        size: 12
                    },
                    formatter: function(value) {
                        return value;
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Victims'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Day of Week'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function createSeasonalChart(ctx) {
    const data = {
        labels: ['Winter', 'Spring', 'Summer', 'Fall'],
        datasets: [{
            data: [42, 68, 63, 42],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(249, 115, 22, 0.8)',
                'rgba(168, 85, 247, 0.8)'
            ],
            borderColor: [
                'rgb(59, 130, 246)',
                'rgb(34, 197, 94)',
                'rgb(249, 115, 22)',
                'rgb(168, 85, 247)'
            ],
            borderWidth: 2
        }]
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${value} victims (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '50%'
        }
    });
}

function createHeatmapChart(ctx) {
    // Simplified heatmap data (day vs time)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const times = ['8-10', '10-12', '12-14', '14-16', '16-18', '18-20'];
    
    // Sample data - replace with your actual hourly distribution per day
    const data = {
        labels: days,
        datasets: times.map((time, timeIndex) => ({
            label: time,
            data: days.map((day, dayIndex) => {
                // Base value with some variation
                let base = 0;
                if (timeIndex === 3 && dayIndex < 5) base = 8; // 2-4 PM on weekdays
                if (timeIndex === 2 && dayIndex === 0) base = 6; // 12-2 PM Monday
                return base + Math.floor(Math.random() * 4);
            }),
            backgroundColor: function(context) {
                const value = context.dataset.data[context.dataIndex];
                const alpha = Math.min(value / 10, 1);
                return `rgba(37, 99, 235, ${alpha})`;
            }
        }))
    };

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Day of Week'
                    }
                },
                y: {
                    stacked: true,
                    title: {
                        display: true,
                        text: 'Number of Victims'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}