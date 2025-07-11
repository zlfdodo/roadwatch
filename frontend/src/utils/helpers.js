export function getColor(hazard) {
    return {
        red: "#e63946",
        yellow: "#f1c40f",
        green: "#2ecc71",
        gray: "#bdc3c7",
    }[hazard] || "#bdc3c7";
}


export function displayValue(value, unit = '') {
    return value != null ? `${value} ${unit}` : 'N/A';
}


export function getEventStyle(type) {
    switch (type) {
        case "CONSTRUCTION":
            return { color: "#e67e22", label: "Construction" };
        case "SPECIAL_EVENT":
            return { color: "#9b59b6", label: "Event" };
        case "INCIDENT":
            return { color: "#e74c3c", label: "Incident" };
        case "WEATHER_CONDITION":
            return { color: "#3498db", label: "Weather" };
        case "ROAD_CONDITION":
            return { color: "#f1c40f", label: "Road Status" };
        default:
            return { color: "#7f8c8d", label: "Other" };
    }
}

export function getEventIcon(type) {
    switch (type) {
        case "CONSTRUCTION":
            return "🚧";
        case "SPECIAL_EVENT":
            return "🎉";
        case "INCIDENT":
            return "🚑";
        case "WEATHER_CONDITION":
            return "🌧️";
        case "ROAD_CONDITION":
            return "🛣️";
        default:
            return "❓";
    }
}

export function formatDateTime(datetimeStr) {
    if (!datetimeStr) return '—';
    const date = new Date(datetimeStr);
    if (isNaN(date)) return datetimeStr;
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

export function formatRecurringSummary(rec) {
    if (!rec) return '—';

    const dayMap = {
        1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu',
        5: 'Fri', 6: 'Sat', 7: 'Sun'
    };

    const days = rec.days?.sort((a, b) => a - b) || [];
    if (days.length === 0) return '—';

    const formatTime12hr = (timeStr) => {
        const [hour, minute] = timeStr.split(':');
        const date = new Date();
        date.setHours(Number(hour));
        date.setMinutes(Number(minute));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const startTime = rec.daily_start_time ? formatTime12hr(rec.daily_start_time) : '';
    const endTime = rec.daily_end_time ? formatTime12hr(rec.daily_end_time) : '';

    if (days.length === 7) {
        return `Mon–Sun · ${startTime}–${endTime}`;
    }

    let isContinuous = true;
    for (let i = 1; i < days.length; i++) {
        if (days[i] !== days[i - 1] + 1) {
            isContinuous = false;
            break;
        }
    }

    if (isContinuous) {
        const first = dayMap[days[0]];
        const last = dayMap[days[days.length - 1]];
        return `${first}–${last} · ${startTime}–${endTime}`;
    }

    const dayLabels = days.map(d => dayMap[d]).join(', ');
    return `${dayLabels} · ${startTime}–${endTime}`;
}

export function formatReadableTime(isoString) {
    if (!isoString) return '—';
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
