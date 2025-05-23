// A simple script to start React in a more optimized way
const { spawn } = require('child_process');

// Set performance-enhancing environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.FAST_REFRESH = 'false';
process.env.BROWSER = 'none'; // Prevent auto-opening browser
process.env.TSC_COMPILE_ON_ERROR = 'true';
process.env.ESLINT_NO_DEV_ERRORS = 'true';

// Start React with optimized settings
const reactStart = spawn('react-scripts', ['start'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Additional optimizations
    GENERATE_SOURCEMAP: 'false',
  },
});

reactStart.on('close', (code) => {
  process.exit(code);
});
