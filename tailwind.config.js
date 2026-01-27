/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        // ═══════════════════════════════════════════════════════════════
        // INNOVA BRAND COLORS (Primary Palette)
        // ═══════════════════════════════════════════════════════════════
        
        // Innova Teal (Primary Brand Color)
        innova: {
          50: '#E6F7F6',
          100: '#B3E8E5',
          200: '#80D9D4',
          300: '#4DCAC3',
          400: '#26BAB1',
          DEFAULT: '#00A99D',  // Main brand color
          500: '#00A99D',
          600: '#00978C',
          700: '#00857B',
          800: '#00736A',
          900: '#006159',
        },
        
        // Innova Navy (Secondary Brand Color)
        'innova-navy': {
          50: '#E8EAED',
          100: '#C5CBCE',
          200: '#9FA8AE',
          300: '#79858F',
          400: '#5E6D78',
          DEFAULT: '#2C3E50',  // Main navy
          500: '#2C3E50',
          600: '#273849',
          700: '#202F3F',
          800: '#192736',
          900: '#0F1A27',
        },
        
        // Innova Orange (Accent Color)
        'innova-orange': {
          50: '#FFF2ED',
          100: '#FFDDD2',
          200: '#FFC7B7',
          300: '#FFB09C',
          400: '#FF9A81',
          DEFAULT: '#FF6F3C',
          500: '#FF6F3C',
          600: '#E65F2F',
          700: '#CC4F22',
          800: '#B33F15',
          900: '#992F08',
        },
        
        // Innova Yellow (Accent Color)
        'innova-yellow': {
          50: '#FFF9E6',
          100: '#FFF0B3',
          200: '#FFE780',
          300: '#FFDD4D',
          400: '#FFD41A',
          DEFAULT: '#FFC857',
          500: '#FFC857',
          600: '#E6B14D',
          700: '#CC9A43',
          800: '#B38339',
          900: '#996C2F',
        },

        // ═══════════════════════════════════════════════════════════════
        // SHADCN/UI COMPATIBILITY LAYER
        // ═══════════════════════════════════════════════════════════════
        
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)'
        },
        
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)'
        },
        
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)'
        },
        
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)'
        },
        
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)'
        },
        
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)'
        },
        
        sidebar: {
          DEFAULT: 'var(--sidebar-background)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)'
        }
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
