// Simulated data based on your credit card fraud analysis
const chartData = {
    // Class distribution data
    classDistribution: {
        labels: ['Normal Transactions', 'Fraudulent Transactions'],
        datasets: [{
            data: [283253, 473], // From your analysis: 284,807 total, 473 fraud
            backgroundColor: [
                'rgba(52, 152, 219, 0.8)',
                'rgba(231, 76, 60, 0.8)'
            ],
            borderColor: [
                'rgba(52, 152, 219, 1)',
                'rgba(231, 76, 60, 1)'
            ],
            borderWidth: 2,
            hoverOffset: 15
        }]
    },
    
    // Transaction amount distribution (box plot simulation)
    amountDistribution: {
        labels: ['Normal Transactions', 'Fraudulent Transactions'],
        datasets: [
            {
                label: '25th Percentile',
                data: [5.65, 1.00],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            },
            {
                label: 'Median',
                data: [22.00, 9.82],
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2
            },
            {
                label: '75th Percentile',
                data: [77.05, 105.89],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            },
            {
                label: 'Mean',
                data: [88.41, 123.87],
                backgroundColor: 'rgba(231, 76, 60, 0.5)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 2,
                type: 'line',
                fill: false
            }
        ]
    },
    
    // Time distribution data (transactions over 48 hours)
    timeDistribution: {
        labels: Array.from({length: 48}, (_, i) => `${i}:00`),
        datasets: [{
            label: 'Normal Transactions',
            data: Array.from({length: 48}, () => Math.floor(Math.random() * 200) + 100),
            backgroundColor: 'rgba(52, 152, 219, 0.5)',
            borderColor: 'rgba(52, 152, 219, 1)',
            borderWidth: 1
        }, {
            label: 'Fraudulent Transactions',
            data: Array.from({length: 48}, () => Math.floor(Math.random() * 5)),
            backgroundColor: 'rgba(231, 76, 60, 0.5)',
            borderColor: 'rgba(231, 76, 60, 1)',
            borderWidth: 1
        }]
    },
    
    // Statistical comparison data
    statComparison: {
        labels: ['Mean Amount (€)', 'Median Amount (€)', 'Standard Deviation (€)'],
        datasets: [
            {
                label: 'Normal Transactions',
                data: [88.41, 22.00, 250.38],
                backgroundColor: 'rgba(52, 152, 219, 0.7)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1
            },
            {
                label: 'Fraudulent Transactions',
                data: [123.87, 9.82, 260.21],
                backgroundColor: 'rgba(231, 76, 60, 0.7)',
                borderColor: 'rgba(231, 76, 60, 1)',
                borderWidth: 1
            }
        ]
    },
    
    // PCA Component importance (first 10 components)
    pcaImportance: {
        labels: ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'],
        datasets: [{
            label: 'Variance Explained',
            data: [0.25, 0.18, 0.12, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02, 0.01],
            backgroundColor: [
                'rgba(46, 204, 113, 0.7)',
                'rgba(46, 204, 113, 0.65)',
                'rgba(46, 204, 113, 0.6)',
                'rgba(46, 204, 113, 0.55)',
                'rgba(46, 204, 113, 0.5)',
                'rgba(46, 204, 113, 0.45)',
                'rgba(46, 204, 113, 0.4)',
                'rgba(46, 204, 113, 0.35)',
                'rgba(46, 204, 113, 0.3)',
                'rgba(46, 204, 113, 0.25)'
            ],
            borderColor: [
                'rgba(46, 204, 113, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(46, 204, 113, 1)',
                'rgba(46, 204, 113, 1)'
            ],
            borderWidth: 1
        }]
    },
    
    // Correlation heatmap data (simulated for key features)
    correlationHeatmap: {
        labels: ['Time', 'Amount', 'V1', 'V2', 'V3', 'V14', 'V17', 'V20'],
        datasets: [
            {
                label: 'Time',
                data: [1.00, 0.03, -0.12, 0.04, 0.18, -0.05, 0.07, -0.09]
            },
            {
                label: 'Amount',
                data: [0.03, 1.00, 0.08, -0.07, 0.05, 0.12, -0.15, 0.06]
            },
            {
                label: 'V1',
                data: [-0.12, 0.08, 1.00, -0.03, -0.25, 0.18, -0.09, 0.14]
            },
            {
                label: 'V2',
                data: [0.04, -0.07, -0.03, 1.00, 0.12, -0.08, 0.20, -0.11]
            },
            {
                label: 'V3',
                data: [0.18, 0.05, -0.25, 0.12, 1.00, -0.15, 0.07, -0.18]
            },
            {
                label: 'V14',
                data: [-0.05, 0.12, 0.18, -0.08, -0.15, 1.00, -0.22, 0.16]
            },
            {
                label: 'V17',
                data: [0.07, -0.15, -0.09, 0.20, 0.07, -0.22, 1.00, -0.07]
            },
            {
                label: 'V20',
                data: [-0.09, 0.06, 0.14, -0.11, -0.18, 0.16, -0.07, 1.00]
            }
        ]
    }
};

// Function to generate random transaction data
function generateTransactionData(count) {
    return Array.from({length: count}, () => Math.floor(Math.random() * 1000));
}

// Export data
window.chartData = chartData;