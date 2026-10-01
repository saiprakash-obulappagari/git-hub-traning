
const alerts = [
    {
        id: 1,
        title: "Heavy Rainfall Monitoring",
        severity: "High",
        location: "Macherla",
        details:
            "Demo scenario: Heavy rainfall may cause waterlogging. " +
            "Check official weather updates and avoid flooded roads.",
        source: "Sample alert"
    },
    {
        id: 2,
        title: "Waterlogging Awareness",
        severity: "Moderate",
        location: "Low-lying areas",
        details:
            "Demo scenario: Water may collect in low-lying areas. " +
            "Report observed flooding and stay away from deep water.",
        source: "Sample alert"
    },
    {
        id: 3,
        title: "Drainage Monitoring",
        severity: "Low",
        location: "Community areas",
        details:
            "Demo scenario: Check drainage conditions and report " +
            "blocked drains to the appropriate local authorities.",
        source: "Sample alert"
    }
];

const reportStorageKey = "disasterShieldReports";

const alertList = document.getElementById("alertList");
const severityFilter = document.getElementById("severityFilter");
const reportForm = document.getElementById("reportForm");
const formMessage = document.getElementById("formMessage");

function displayAlerts() {
    const selectedSeverity = severityFilter.value;

    const filteredAlerts = alerts.filter(function(alert) {
        return selectedSeverity === "all" ||
            alert.severity === selectedSeverity;
    });

    alertList.innerHTML = "";

    if (filteredAlerts.length === 0) {
        alertList.textContent = "No alerts match this filter.";
        return;
    }

    filteredAlerts.forEach(function(alert) {
        const card = document.createElement("article");
        card.className = "alert-card";

        const top = document.createElement("div");
        top.className = "alert-top";

        const title = document.createElement("h3");
        title.textContent = alert.title;

        const badge = document.createElement("span");
        badge.className =
            "badge " + alert.severity.toLowerCase();
        badge.textContent = alert.severity;

        top.append(title, badge);

        const location = document.createElement("p");
        location.textContent = "📍 " + alert.location;

        const details = document.createElement("p");
        details.textContent = alert.details;

        const source = document.createElement("p");
        source.textContent = alert.source + " — Demo only";

        card.append(top, location, details, source);
        alertList.appendChild(card);
    });
}

function getReports() {
    try {
        const saved = localStorage.getItem(reportStorageKey);
        const reports = saved ? JSON.parse(saved) : [];

        return Array.isArray(reports) ? reports : [];
    } catch (error) {
        return [];
    }
}

function saveReports(reports) {
    try {
        localStorage.setItem(
            reportStorageKey,
            JSON.stringify(reports)
        );
        return true;
    } catch (error) {
        return false;
    }
}

function displayReports() {
    const reports = getReports();
    const reportList =
        document.getElementById("communityReports");

    document.getElementById("reportCount").textContent =
        reports.length;

    reportList.innerHTML = "";

    if (reports.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty-message";
        empty.textContent =
            "No community reports submitted yet.";
        reportList.appendChild(empty);
        return;
    }

    reports.slice().reverse().forEach(function(report) {
        const item = document.createElement("article");
        item.className = "report-item";

        const title = document.createElement("h3");
        title.textContent = report.type;

        const location = document.createElement("p");
        location.textContent = "📍 " + report.location;

        const details = document.createElement("p");
        details.textContent = report.details;

        const time = document.createElement("p");
        time.className = "report-time";
        time.textContent =
            "Submitted: " + report.time;

        item.append(title, location, details, time);
        reportList.appendChild(item);
    });
}

reportForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const type =
        document.getElementById("reportType").value;

    const location =
        document.getElementById("reportLocation")
            .value.trim();

    const details =
        document.getElementById("reportDetails")
            .value.trim();

    if (!type || !location || !details) {
        formMessage.textContent =
            "Please complete all fields.";
        return;
    }

    const report = {
        id: Date.now(),
        type: type,
        location: location,
        details: details,
        time: new Date().toLocaleString()
    };

    const reports = getReports();
    reports.push(report);

    if (!saveReports(reports)) {
        formMessage.textContent =
            "Could not save the report. Check browser storage.";
        return;
    }

    formMessage.textContent =
        "Demo report saved in this browser.";

    reportForm.reset();
    displayReports();
});

severityFilter.addEventListener("change", displayAlerts);

displayAlerts();
displayReports();