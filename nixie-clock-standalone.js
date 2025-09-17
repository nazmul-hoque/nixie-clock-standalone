/**
 * Nixie Clock Standalone
 * A retro nixie clock with stunning animations
 * Converted from MMM-Nixie-Clock by Isaac-the-Man
 * MIT Licensed.
 */

class NixieClock {
    constructor(config = {}) {
        this.config = {
            size: 'large',
            reflection: true,
            timeFormat: 24,
            displaySeconds: true,
            displayDateInterval: 2,
            displayDateTime: 3,
            tz: 'default',
            tz_title: 'default'
        };

        Object.assign(this.config, config);

        this.global = {
            mode: 'clock',
            flipIndex: [],
            resetFlag: false,
            prevTime: [0,0,0,0,0,0],
            nextTime: [0,0,0,0,0,0]
        };

        this.container = null;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error('Container element not found:', containerId);
            return;
        }

        this.validateConfig();
        this.setupControls();
        this.start();
    }

    validateConfig() {
        const validSizes = ['mini', 'small', 'medium', 'large'];
        const validTimeFormats = [12, 24];
        
        if (!validSizes.includes(this.config.size)) {
            console.warn(`Invalid size "${this.config.size}". Using default "large".`);
            this.config.size = 'large';
        }
        
        if (typeof this.config.reflection !== "boolean") {
            console.warn("Invalid reflection option. Using default true.");
            this.config.reflection = true;
        }
        
        if (!validTimeFormats.includes(this.config.timeFormat)) {
            console.warn(`Invalid timeFormat "${this.config.timeFormat}". Using default 24.`);
            this.config.timeFormat = 24;
        }
        
        if (typeof this.config.displaySeconds !== "boolean") {
            console.warn("Invalid displaySeconds option. Using default true.");
            this.config.displaySeconds = true;
        }
        
        if (!Number.isInteger(this.config.displayDateInterval) || 
            this.config.displayDateInterval < 0 || 
            this.config.displayDateInterval > 5) {
            console.warn(`Invalid displayDateInterval "${this.config.displayDateInterval}". Using default 2.`);
            this.config.displayDateInterval = 2;
        }
        
        if (this.config.displayDateInterval === 0) {
            this.config.displayDateTime = 0;
        } else if (!Number.isInteger(this.config.displayDateTime) || 
                   this.config.displayDateTime <= 0 || 
                   this.config.displayDateTime > 3) {
            console.warn(`Invalid displayDateTime "${this.config.displayDateTime}". Using default 3.`);
            this.config.displayDateTime = 3;
        }
        
        if (typeof this.config.tz !== "string") {
            console.warn("Invalid timezone. Using default.");
            this.config.tz = 'default';
        }
        
        if (typeof this.config.tz_title !== "string") {
            console.warn("Invalid timezone title. Using default.");
            this.config.tz_title = 'default';
        }
    }

    setupControls() {
        const controlMap = {
            size: 'size',
            reflection: 'reflection',
            timeFormat: 'timeFormat',
            displaySeconds: 'displaySeconds',
            displayDateInterval: 'displayDateInterval',
            displayDateTime: 'displayDateTime',
            timezone: 'timezone',
            timezoneTitle: 'timezoneTitle'
        };

        Object.entries(controlMap).forEach(([key, elementId]) => {
            const element = document.getElementById(elementId);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.config[key];
                } else {
                    element.value = this.config[key] || '';
                }
                
                element.addEventListener('change', () => this.updateConfig(key, element));
            }
        });
    }

    updateConfig(key, element) {
        if (element.type === 'checkbox') {
            this.config[key] = element.checked;
        } else if (['timeFormat', 'displayDateInterval', 'displayDateTime'].includes(key)) {
            this.config[key] = parseInt(element.value);
        } else {
            this.config[key] = element.value || '';
        }
        
        this.validateConfig();
        this.updateDisplay();
    }

    start() {
        console.log("Starting Nixie Clock");
        this.updateDisplay();
        this.clockUpdate();
    }

    clockUpdate() {
        this.updateDisplay();

        if (['clock', 'date'].includes(this.global.mode)) {
            this.global.flipIndex = this.checkFlip(this.getMoment());
        }
        
        if (['clock', 'date'].includes(this.global.mode) && this.global.flipIndex.length > 0) {
            this.startDigitReset();
        }

        setTimeout(() => this.clockUpdate(), this.getDelay());
    }

    startDigitReset() {
        const prevMode = this.global.mode;
        this.global.mode = 'reset';
        this.global.resetFlag = true;
        
        this.global.flipIndex.forEach(i => {
            this.global.prevTime[i] = 9;
        });
        
        const delay = this.config.displaySeconds || prevMode === 'date' 
            ? 1000 - this.getMoment().milliseconds() + 50
            : (60 - this.getMoment().seconds()) * 1000 - this.getMoment().milliseconds() + 50;
        
        const digitCount = this.config.displaySeconds ? 6 : 4;
        
        setTimeout(() => {
            for (let i = 0; i < digitCount; i++) {
                if (!this.global.flipIndex.includes(i)) {
                    this.global.prevTime[i] = this.global.nextTime[i];
                }
            }
        }, delay);
    }

    updateDisplay() {
        const now = this.getMoment();
        let time = this.getTime(now);
        
        if (this.global.mode === 'reset') {
            this.global.flipIndex.forEach(i => time[i]--);
            
            if (time[this.global.flipIndex[0]] === 0) {
                this.endDigitReset(now);
                time = this.getTime(now);
            }
        }
        
        this.renderClock(time);
        this.global.prevTime = time;
    }

    endDigitReset(now) {
        const shouldShowDate = this.config.displayDateInterval !== 0 && 
                              now.seconds() >= 0 && 
                              now.seconds() <= this.config.displayDateTime && 
                              now.minutes() % this.config.displayDateInterval === 0;
        
        if (shouldShowDate) {
            this.global.mode = 'date';
        } else {
            this.global.mode = 'clock';
            // Fix 12:00 PM to 01:00 PM in 12hr mode
            if (this.config.timeFormat === 12 && this.getMoment().hour() === 13) {
                this.global.prevTime[1] = 1;
            }
        }
    }

    renderClock(time) {
        const container = document.createElement("div");
        
        if (this.config.tz && this.config.tz !== "default" && this.config.tz_title && this.config.tz_title !== "") {
            const tzTitle = document.createElement("div");
            tzTitle.innerHTML = this.config.tz_title === "default" ? this.config.tz : this.config.tz_title;
            tzTitle.classList.add("timezone-title");
            container.appendChild(tzTitle);
        }
        
        const display = document.createElement("div");
        display.classList.add("digit_display");
        
        // Create time digits
        display.appendChild(this.createTube(time[0]));
        display.appendChild(this.createTube(time[1]));
        display.appendChild(this.createDot());
        display.appendChild(this.createTube(time[2]));
        display.appendChild(this.createTube(time[3]));
        
        if (this.config.displaySeconds) {
            display.appendChild(this.createDot());
            display.appendChild(this.createTube(time[4]));
            display.appendChild(this.createTube(time[5]));
        }
        
        container.appendChild(display);
        this.container.innerHTML = '';
        this.container.appendChild(container);
    }

    getMoment() {
        return this.config.tz !== "default" ? moment().tz(this.config.tz) : moment();
    }

    createTube(n) {
        const digit = document.createElement("img");
        digit.src = `nixie-digits/${this.config.size}/${n}.png`;
        digit.classList.add(`tube-${this.config.size}`);
        
        if (this.config.reflection) {
            digit.classList.add("reflect");
        }
        
        return digit;
    }

    createDot() {
        const digit = document.createElement("div");
        digit.classList.add("digit", `dot-${this.config.size}`);
        digit.textContent = ".";
        
        if (this.config.reflection) {
            digit.classList.add("reflect");
        }
        
        return digit;
    }

    timeToArr(now) {
        const hour = now.hour() > 12 ? now.hour() % this.config.timeFormat : now.hour();
        const digits = [
            this.getFirstDigit(hour),
            this.getSecondDigit(hour),
            this.getFirstDigit(now.minutes()),
            this.getSecondDigit(now.minutes())
        ];
        
        if (this.config.displaySeconds) {
            digits.push(
                this.getFirstDigit(now.seconds()),
                this.getSecondDigit(now.seconds())
            );
        }
        
        return digits;
    }

    dateToArr(now) {
        const digits = [
            this.getFirstDigit(now.date()),
            this.getSecondDigit(now.date()),
            this.getFirstDigit(now.month() + 1),
            this.getSecondDigit(now.month() + 1)
        ];
        
        if (this.config.displaySeconds) {
            digits.push(
                this.getFirstDigit(now.year() % 100),
                this.getSecondDigit(now.year() % 100)
            );
        }
        
        return digits;
    }

    getTime(now) {
        if (this.global.mode === 'clock' || 
            (this.global.mode === 'date' && now.seconds() > this.config.displayDateTime)) {
            return this.timeToArr(now);
        }
        
        if (this.global.mode === 'date' || 
            (this.global.mode === 'clock' && this.shouldShowDate(now))) {
            return this.dateToArr(now);
        }
        
        if (this.global.mode === 'reset') {
            return this.global.prevTime;
        }
    }

    shouldShowDate(now) {
        return this.config.displayDateInterval !== 0 && 
               now.minutes() % this.config.displayDateInterval === 0 && 
               now.seconds() >= 0 && 
               now.seconds() <= this.config.displayDateTime;
    }

    getFirstDigit(n) {
        return n > 9 ? Math.floor(n / 10) : 0;
    }

    getSecondDigit(n) {
        return n % 10;
    }

    checkFlip(now) {
        const flipIndex = [];
        const seconds = (now.seconds() + 1) % 60;
        const minutes = now.minutes() + (seconds === 0 ? 1 : 0);
        const next = this.config.displaySeconds ? 
            now.clone().add(1, 'seconds') : 
            now.clone().add(1, 'minutes');
        
        if (this.global.mode === 'date' && seconds > this.config.displayDateTime) {
            this.global.mode = 'clock';
            this.global.nextTime = this.timeToArr(next);
            return this.getAllFlipIndices();
        }
        
        if (this.global.mode === 'clock') {
            if (this.shouldShowDate(now)) {
                this.global.mode = 'date';
                this.global.nextTime = this.dateToArr(next);
                return this.getAllFlipIndices();
            } else {
                this.global.nextTime = this.timeToArr(next);
                const nowArr = this.timeToArr(now);
                const digitCount = this.config.displaySeconds ? 6 : 4;
                
                // Only trigger flip animation for actual rollovers (not normal counting)
                for (let i = 0; i < digitCount; i++) {
                    // Check if this is a real rollover (e.g., 59->00, 23->00, etc.)
                    if (this.global.nextTime[i] < nowArr[i]) {
                        // For seconds (last 2 digits), only flip if rolling over to new minute
                        if (this.config.displaySeconds && i >= 4) {
                            // Only flip seconds if we're rolling over to a new minute
                            if (now.seconds() === 59) {
                                flipIndex.push(i);
                            }
                        } else if (!this.config.displaySeconds && i >= 2) {
                            // Only flip minutes if we're rolling over to a new hour
                            if (now.minutes() === 59) {
                                flipIndex.push(i);
                            }
                        } else {
                            // For hours, always flip on rollover
                            flipIndex.push(i);
                        }
                    }
                }
            }
        }
        
        return flipIndex;
    }

    getAllFlipIndices() {
        const digitCount = this.config.displaySeconds ? 6 : 4;
        return Array.from({ length: digitCount }, (_, i) => i);
    }

    getDelay() {
        const now = this.getMoment();
        const baseDelay = 1000 - now.milliseconds() + 50;
        
        if (this.global.mode === 'clock') {
            return this.config.displaySeconds ? baseDelay : (60 - now.seconds()) * 1000 - now.milliseconds() + 50;
        }
        
        if (this.global.mode === 'date') {
            return baseDelay;
        }
        
        if (this.global.mode === 'reset') {
            if (this.global.resetFlag) {
                this.global.resetFlag = false;
                return this.config.displaySeconds ? 
                    800 - now.milliseconds() : 
                    (59 - now.seconds()) * 1000 + 800 - now.milliseconds();
            }
            return 50;
        }
    }
}

// Initialize the clock when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NixieClock().init('nixie-clock');
});