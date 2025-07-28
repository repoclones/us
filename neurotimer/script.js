import { config } from './config.js';

// Initialize timer
function initTimer() {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    generateGears();
}

// Get the next occurrence of the configured date (ignores year)
function getNextTargetTimestamp(month, day, hour = 0, minute = 0, second = 0) {
    const now = new Date();
    const currentYear = now.getFullYear();

    let target = new Date(currentYear, month - 1, day, hour, minute, second);

    // If the target has already passed this year, go to next year
    if (target.getTime() <= now.getTime()) {
        target = new Date(currentYear + 1, month - 1, day, hour, minute, second);
    }

    return Math.floor(target.getTime() / 1000);
}

// Calculate and update the countdown
function updateCountdown() {
    const now = Math.floor(Date.now() / 1000); // Current Unix timestamp
    const targetTimestamp = getNextTargetTimestamp(
        config.targetMonth,
        config.targetDay,
        config.targetHour || 0,
        config.targetMinute || 0,
        config.targetSecond || 0
    );
    const timeLeft = targetTimestamp - now;

    if (timeLeft <= 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(timeLeft / 86400);
    const hours = Math.floor((timeLeft % 86400) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    document.getElementById('days').textContent = formatTime(days);
    document.getElementById('hours').textContent = formatTime(hours);
    document.getElementById('minutes').textContent = formatTime(minutes);
    document.getElementById('seconds').textContent = formatTime(seconds);
}

// Add leading zero if needed
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// Generate the SVG gears
function generateGears() {
    const container = document.querySelector('.gears-container');

    for (let i = 0; i < config.gears.count; i++) {
        const size = Math.random() * (config.gears.maxSize - config.gears.minSize) + config.gears.minSize;
        const isOutline = Math.random() < config.gears.outlineChance;

        const gearElement = document.createElement('div');
        gearElement.classList.add('gear');

        fetch('./2789-200.svg')
            .then(response => response.text())
            .then(svgText => {
                let color, strokeWidth, stroke;

                if (isOutline) {
                    color = 'none';
                    stroke = 'white';
                    strokeWidth = '5';
                } else {
                    const lightness = Math.floor(Math.random() * 25) + 95;
                    color = `hsl(340, 100%, ${lightness}%)`;
                    stroke = 'none';
                    strokeWidth = '0';
                }

                let modifiedSvg = svgText.replace(/fill="[^"]*"/g, `fill="${color}"`);
                modifiedSvg = modifiedSvg.replace(/<svg/, `<svg stroke="${stroke}" stroke-width="${strokeWidth}"`);

                gearElement.innerHTML = modifiedSvg;

                const svgElement = gearElement.querySelector('svg');
                if (svgElement) {
                    svgElement.setAttribute('width', size);
                    svgElement.setAttribute('height', size);
                }
            });

        gearElement.style.left = `${Math.random() * 100}%`;
        gearElement.style.top = `${Math.random() * 100}%`;

        const duration = Math.random() * (config.gears.maxSpeed - config.gears.minSpeed) + config.gears.minSpeed;
        const direction = Math.random() > 0.5 ? 'normal' : 'reverse';
        gearElement.style.animation = `rotate ${duration}s linear infinite ${direction}`;

        container.appendChild(gearElement);
    }
}

// Add rotation animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', initTimer);
