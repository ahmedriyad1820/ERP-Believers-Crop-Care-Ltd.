# BCC ERP - Believers Crop Care Ltd.

A responsive React application for Believers Crop Care Ltd. built with Vite and React.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Mobile Testing

#### Option 1: Browser Dev Tools (Easiest)
1. Start the dev server: `npm run dev`
2. Open Chrome/Edge DevTools (F12)
3. Click the device toolbar icon (Ctrl+Shift+M / Cmd+Shift+M)
4. Select a device preset or set custom dimensions
5. Test different screen sizes

#### Option 2: Test on Real Mobile Device
1. Start the dev server: `npm run dev`
2. Find your computer's local IP address:
   - **Mac/Linux**: Run `ifconfig` or `ip addr` in terminal
   - **Windows**: Run `ipconfig` in command prompt
   - Look for IPv4 address (e.g., `192.168.1.100`)
3. Make sure your mobile device is on the same Wi-Fi network
4. On your mobile device, open browser and go to: `http://YOUR_IP_ADDRESS:5173`
   - Example: `http://192.168.1.100:5173`
5. The site should load on your mobile device!

#### Option 3: Build and Preview
```bash
npm run build
npm run preview
```
Then access via network IP as shown in Option 2.

### Build for Production

```bash
npm run build
```

## Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 768px
- **Small Mobile**: Below 480px

## Features

- Fully responsive design
- Multi-language support (English/Bengali)
- Mobile-optimized navigation
- Touch-friendly interactions
- Smooth scrolling
- Optimized images and assets
