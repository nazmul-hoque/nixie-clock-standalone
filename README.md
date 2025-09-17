# Nixie Clock - Standalone Version

A retro nixie clock with stunning animations, converted to run independently without MagicMirror.

![Nixie](screenshots/nixie.PNG)

## Features

- **Retro Nixie Tube Display**: Beautiful vintage nixie tube digit display
- **Digit Reset Animation**: Smooth animation when digits change
- **Multiple Sizes**: Mini, small, medium, and large display sizes
- **Time Formats**: 12-hour and 24-hour time display
- **Date Display**: Optional date display with configurable intervals
- **Timezone Support**: Display time in different timezones
- **Reflection Effect**: Optional glass reflection effect
- **Real-time Controls**: Change settings without refreshing the page

## Quick Start

1. Open `index.html` in a web browser
2. The clock will start automatically
3. Use the control panel below the clock to adjust settings

## Configuration Options

| Option | Description | Default | Values |
|--------|-------------|---------|--------|
| **Size** | Display size of the nixie tubes | `large` | `mini`, `small`, `medium`, `large` |
| **Reflection** | Show glass reflection effect | `true` | `true`, `false` |
| **Time Format** | 12 or 24 hour display | `24` | `12`, `24` |
| **Show Seconds** | Display seconds (6-digit vs 4-digit clock) | `true` | `true`, `false` |
| **Date Interval** | How often to show date (in minutes) | `2` | `0` (never) to `5` |
| **Date Display Time** | How long to show date (in seconds) | `3` | `1`, `2`, `3` |
| **Timezone** | Timezone for display | `default` | `default` or timezone string (e.g., `America/New_York`) |
| **Timezone Title** | Custom title for timezone | `default` | Any string or `default` |

## File Structure

```
MMM-nixie-clock/
├── index.html                    # Main HTML file
├── nixie-clock-standalone.js    # Standalone JavaScript
├── css/
│   └── default.css              # Styles
├── nixie-digits/                # Nixie tube digit images
│   ├── mini/                    # Mini size digits (0-9.png)
│   ├── small/                   # Small size digits (0-9.png)
│   ├── medium/                  # Medium size digits (0-9.png)
│   └── large/                   # Large size digits (0-9.png)
├── moment.js                    # Moment.js library
└── moment-timezone-with-data.js # Moment timezone library
```

## Usage

### Basic Usage

Simply open `index.html` in any modern web browser. The clock will start automatically.

### Programmatic Usage

You can also create and configure the clock programmatically:

```javascript
// Create a new clock instance
const clock = new NixieClock({
    size: 'large',
    reflection: true,
    timeFormat: 24,
    displaySeconds: true,
    displayDateInterval: 2,
    displayDateTime: 3,
    tz: 'America/New_York',
    tz_title: 'New York'
});

// Initialize it in a container
clock.init('my-clock-container');
```

### Custom Configuration

You can modify the default configuration by editing the `NixieClock` constructor in `nixie-clock-standalone.js`:

```javascript
this.config = {
    size: 'large',              // Change default size
    reflection: true,            // Change default reflection
    timeFormat: 24,             // Change default time format
    displaySeconds: true,       // Change default seconds display
    displayDateInterval: 2,     // Change default date interval
    displayDateTime: 3,         // Change default date display time
    tz: 'default',              // Change default timezone
    tz_title: 'default'         // Change default timezone title
};
```

## Browser Compatibility

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Dependencies

- **Moment.js**: For date/time handling
- **Moment Timezone**: For timezone support

## Credits

- Original MagicMirror module by [Isaac-the-Man](https://github.com/Isaac-the-Man/MMM-nixie-clock)
- Nixie tube digit images by [Dalibor Farny](https://www.daliborfarny.com/)
- Converted to standalone by AI Assistant

## License

MIT Licensed - see LICENSE file for details.
