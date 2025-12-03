[index.html](https://github.com/user-attachments/files/23894989/index.html)[Uploading index.
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FitMirror - AI Body Measurement</title>
    <meta name="theme-color" content="#3C82F6" />
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="manifest" href="/manifest.json" />
    <link rel="apple-touch-icon" href="/logo192.png" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              primary: {
                DEFAULT: '#3C82F6', // Tech Blue
                dark: '#2563EB',
                light: '#60A5FA'
              },
              secondary: {
                DEFAULT: '#8B5CF6', // Violet Glow
                dark: '#7C3AED',
                light: '#A78BFA'
              },
              accent: '#111827',
              surface: {
                light: '#F7F9FC',
                dark: '#0F0F0F'
              }
            },
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              arabic: ['Cairo', 'sans-serif'],
            },
            animation: {
              'scan': 'scan 3s ease-in-out infinite',
              'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
              scan: {
                '0%, 100%': { top: '0%' },
                '50%': { top: '100%' },
              }
            }
          },
        },
      }
    </script>
    <style>
      /* Smooth scrolling for the whole page */
      html {
        scroll-behavior: smooth;
      }
      .glass-panel {
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .dark .glass-panel {
        background: rgba(30, 30, 30, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react-router-dom": "https://aistudiocdn.com/react-router-dom@^7.9.6",
    "lucide-react": "https://aistudiocdn.com/lucide-react@^0.555.0",
    "react": "https://aistudiocdn.com/react@^19.2.0",
    "react/": "https://aistudiocdn.com/react@^19.2.0/",
    "react-dom/": "https://aistudiocdn.com/react-dom@^19.2.0/",
    "@google/genai": "https://aistudiocdn.com/@google/genai@^1.30.0"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body class="bg-surface-light dark:bg-surface-dark text-slate-800 dark:text-slate-100 transition-colors duration-300">
    <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>
html…]()
