let requestCount = 0;
let startTime = Date.now();
let performanceChart;
let performanceData = {
    labels: [],
    datasets: [{
        label: 'Response Time (ms)',
        data: [],
        borderColor: '#2196f3',
        tension: 0.4
    }]
};

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    performanceChart = new Chart(ctx, {
        type: 'line',
        data: performanceData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateUptime() {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('uptime').textContent = uptime;
}

function updateResourceMeters() {
    // Simulate CPU and Memory usage
    const cpuUsage = Math.floor(Math.random() * 100);
    const memoryUsage = Math.floor(Math.random() * 100);

    document.getElementById('cpuUsage').style.width = `${cpuUsage}%`;
    document.getElementById('cpuUsage').textContent = `${cpuUsage}%`;
    document.getElementById('memoryUsage').style.width = `${memoryUsage}%`;
    document.getElementById('memoryUsage').textContent = `${memoryUsage}%`;
}

function addLogEntry(message, type = 'info') {
    const logsContainer = document.getElementById('logsContainer');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;

    const icon = document.createElement('i');
    icon.className = `fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}`;

    const text = document.createElement('span');
    text.textContent = message;

    entry.appendChild(icon);
    entry.appendChild(text);
    logsContainer.insertBefore(entry, logsContainer.firstChild);
}

function updateStatus() {
    const startTime = performance.now();

    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            const responseTime = performance.now() - startTime;
            requestCount++;

            // Update status message
            document.getElementById('requests').textContent = requestCount;
            document.getElementById('status-message').textContent = data.message;

            // Update performance chart
            const timestamp = new Date().toLocaleTimeString();
            performanceData.labels.push(timestamp);
            performanceData.datasets[0].data.push(responseTime);

            // Keep only last 10 data points
            if (performanceData.labels.length > 10) {
                performanceData.labels.shift();
                performanceData.datasets[0].data.shift();
            }

            performanceChart.update();

            // Add log entry
            addLogEntry(`Request successful (${Math.round(responseTime)}ms)`);
        })
        .catch(error => {
            document.getElementById('status-message').textContent = 'Error connecting to server';
            addLogEntry('Connection error', 'error');
        });
}

// Theme toggling
document.querySelector('.theme-toggle').addEventListener('click', function() {
    document.body.setAttribute('data-theme',
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

// Initialize
initializeChart();
updateStatus();
updateUptime();
updateResourceMeters();

// Update intervals
setInterval(updateStatus, 5000);
setInterval(updateUptime, 1000);
setInterval(updateResourceMeters, 2000);
