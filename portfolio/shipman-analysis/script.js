// Load and display data
document.addEventListener('DOMContentLoaded', function() {
    // Load JSON data
    fetch('data/analysis_results.json')
        .then(response => response.json())
        .then(data => {
            displayStatistics(data.summary_statistics);
            createAgeChart(data.age_distribution);
            createYearChart(data.year_distribution);
            createScatterPlot(data.raw_data_sample);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            document.getElementById('stats-container').innerHTML = 
                '<p class="error">Error loading data. Please try again later.</p>';
        });
});

// Display statistics
function displayStatistics(stats) {
    document.getElementById('total-victims').textContent = stats.total_victims;
    document.getElementById('avg-age').textContent = `${stats.average_age.toFixed(1)} years`;
    document.getElementById('youngest').textContent = `${stats.youngest_victim} years`;
    document.getElementById('oldest').textContent = `${stats.oldest_victim} years`;
}

// Create age distribution chart
function createAgeChart(ageData) {
    const ctx = document.getElementById('ageChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ageData.labels,
            datasets: [{
                label: 'Number of Victims',
                data: ageData.counts,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
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
                            const index = context.dataIndex;
                            const percentage = ageData.percentages[index];
                            return `${context.dataset.label}: ${context.raw} (${percentage}%)`;
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
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Age Group'
                    }
                }
            }
        }
    });
}

// Create year distribution chart
function createYearChart(yearData) {
    const ctx = document.getElementById('yearChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: yearData.years,
            datasets: [{
                label: 'Victims per Year',
                data: yearData.victims_per_year,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Victims'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    });
}

// Create interactive scatter plot using Plotly
function createScatterPlot(rawData) {
    const years = rawData.map(item => item.fractionalDeathYear);
    const ages = rawData.map(item => item.Age);
    
    const trace = {
        x: years,
        y: ages,
        mode: 'markers',
        type: 'scatter',
        marker: {
            size: 8,
            color: ages,
            colorscale: 'Viridis',
            showscale: true,
            colorbar: {
                title: 'Age'
            }
        },
        text: rawData.map((item, i) => 
            `Victim ${i+1}<br>Age: ${item.Age}<br>Year: ${item.fractionalDeathYear.toFixed(2)}`
        ),
        hoverinfo: 'text'
    };
    
    const layout = {
        title: 'Victim Age vs Year of Death',
        xaxis: {
            title: 'Year of Death',
            gridcolor: 'lightgray'
        },
        yaxis: {
            title: 'Age',
            gridcolor: 'lightgray'
        },
        plot_bgcolor: 'white',
        paper_bgcolor: 'white',
        hovermode: 'closest'
    };
    
    Plotly.newPlot('scatterPlot', [trace], layout, {responsive: true});
}

// Add interactivity to stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});