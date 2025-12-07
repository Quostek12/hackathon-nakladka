// Palette inspired by light, airy mobile citizen apps (mobywatel-like)
const primaryLight = '#007B9E'; // deep-teal primary
const accentLight = '#00B4D8'; // bright aqua accent
const backgroundLight = '#F4FCFF'; // very light aqua
const textLight = '#06292B';

const primaryDark = '#4FD1C5';
const backgroundDark = '#041F20';
const textDark = '#E6F6F7';

export default {
  light: {
    text: textLight,
    background: backgroundLight,
    tint: primaryLight,
    accent: accentLight,
    tabIconDefault: '#ccc',
    tabIconSelected: primaryLight,
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    tint: primaryDark,
    accent: accentLight,
    tabIconDefault: '#ccc',
    tabIconSelected: primaryDark,
  },
};
