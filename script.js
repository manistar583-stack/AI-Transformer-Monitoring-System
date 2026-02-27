// ======================================
// AI TRANSFORMER MONITORING SYSTEM
// FULL UPDATED VERSION
// ======================================

// ================= DATA STORAGE =================
let oilData = [];
let windingData = [];
let loadData = [];
let labels = [];

let alertTriggered = false;
let notificationAllowed = false;

// ================= NOTIFICATION PERMISSION =================
if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            notificationAllowed = true;
        }
    });
}

// ================= SOUND FUNCTION =================
function playAlarm() {
    let sound = document.getElementById("alarmSound");
    if (sound) sound.play();
}

// ================= BROWSER NOTIFICATION =================
function showNotification(message) {
    if (notificationAllowed) {
        new Notification("Transformer Alert 🚨", {
            body: message
        });
    }
}

// ================= MANUAL TRIP =================
function tripSystem() {
    document.getElementById("tripStatus").innerHTML =
        "⚡ Circuit Breaker TRIPPED!";
    document.getElementById("tripStatus").className = "critical";

    playAlarm();
    showNotification("Circuit Breaker Tripped!");
}

// ================= CREATE GRAPHS =================
window.onload = function () {

    const oilCtx = document.getElementById('oilChart').getContext('2d');
    const windingCtx = document.getElementById('windingChart').getContext('2d');
    const loadCtx = document.getElementById('loadChart').getContext('2d');

    window.oilChart = new Chart(oilCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Oil Temp (°C)',
                data: oilData,
                borderColor: 'blue',
                borderWidth: 2
            }]
        }
    });

    window.windingChart = new Chart(windingCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Winding Temp (°C)',
                data: windingData,
                borderColor: 'orange',
                borderWidth: 2
            }]
        }
    });

    window.loadChart = new Chart(loadCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Load Current (A)',
                data: loadData,
                borderColor: 'green',
                borderWidth: 2
            }]
        }
    });

    updateData();
    setInterval(updateData, 3000);
};

// ================= MAIN UPDATE FUNCTION =================
function updateData() {

    // Generate random values
    let oil = Math.floor(Math.random() * 40) + 50;
    let winding = Math.floor(Math.random() * 40) + 50;
    let load = Math.floor(Math.random() * 100) + 80;

    // Update display
    document.getElementById("oil").innerHTML = oil + " °C";
    document.getElementById("winding").innerHTML = winding + " °C";
    document.getElementById("load").innerHTML = load + " A";

    // Health Index Formula
    let healthIndex = 100 - ((oil + winding) / 4);

    let healthElement = document.getElementById("health");
    let alarmElement = document.getElementById("alarm");

    healthElement.innerHTML = healthIndex.toFixed(0) + "%";

    // ================= HEALTH LOGIC =================
    if (healthIndex > 80) {

        healthElement.className = "health-index healthy";
        healthElement.innerHTML += " - Healthy";
        alarmElement.innerHTML = "System Normal";
        alarmElement.className = "healthy";
        alertTriggered = false;

    }
    else if (healthIndex > 50) {

        healthElement.className = "health-index warning";
        healthElement.innerHTML += " - Warning";
        alarmElement.innerHTML = "⚠ Warning Condition";
        alarmElement.className = "warning";
        alertTriggered = false;

    }
    else {

        healthElement.className = "health-index critical";
        healthElement.innerHTML += " - Critical";
        alarmElement.innerHTML = "🚨 Critical - Trip Required!";
        alarmElement.className = "critical";

        if (!alertTriggered) {
            alert("🚨 CRITICAL ALERT! Transformer Trip Required!");
            playAlarm();
            showNotification("Critical Transformer Condition!");
            alertTriggered = true;
        }
    }

    // ================= GRAPH UPDATE =================
    oilData.push(oil);
    windingData.push(winding);
    loadData.push(load);
    labels.push("");

    if (oilData.length > 10) {
        oilData.shift();
        windingData.shift();
        loadData.shift();
        labels.shift();
    }

    oilChart.update();
    windingChart.update();
    loadChart.update();
}

// ================= DOWNLOAD REPORT =================
function downloadReport() {

    let reportContent =
        "Transformer Monitoring Report\n\n" +
        "Oil Temperature Data: " + oilData.join(", ") + "\n\n" +
        "Winding Temperature Data: " + windingData.join(", ") + "\n\n" +
        "Load Current Data: " + loadData.join(", ");

    let blob = new Blob([reportContent], { type: "text/plain" });
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "Transformer_Report.txt";
    link.click();
}