---
name: Architectural Precision
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c6'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636465'
  inverse-primary: '#5d5f5f'
  secondary: '#c6c6cf'
  on-secondary: '#2f3037'
  secondary-container: '#45464e'
  on-secondary-container: '#b4b4bd'
  tertiary: '#fffeff'
  on-tertiary: '#342f2d'
  tertiary-container: '#eae0dd'
  on-tertiary-container: '#696360'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e2e1eb'
  secondary-fixed-dim: '#c6c6cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#45464e'
  tertiary-fixed: '#eae0dd'
  tertiary-fixed-dim: '#cec4c2'
  on-tertiary-fixed: '#1f1b19'
  on-tertiary-fixed-variant: '#4b4543'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-serif:
    fontFamily: Instrument Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is rooted in the philosophy of "Proof over claims." It targets builders and engineers who value performance, clarity, and structural integrity. The aesthetic is **High-End Minimalist**, drawing inspiration from modern developer tooling while maintaining a warmer, more sophisticated editorial edge.

The interface prioritizes content and code over chrome. It uses a layered, neutral approach to create depth without relying on heavy shadows or vibrant colors. The emotional response is one of calm authority—a workspace that feels stable, professional, and timeless.

## Colors

This design system utilizes a layered neutral palette to define hierarchy. Pure #000 and #FFF are avoided to reduce eye strain and maintain a premium feel.

### Dark Mode (Primary)
- **Background**: `#09090B` (Deep charcoal)
- **Surface (Layer 1)**: `#121214` (Subtle elevation)
- **Surface (Layer 2)**: `#18181B` (Cards and modals)
- **Border**: `#27272A` (Low contrast separation)
- **Text Primary**: `#F4F4F5`
- **Text Secondary**: `#A1A1AA`

### Light Mode (Refined Warmth)
- **Background**: `#F9F8F6` (Warm paper)
- **Surface (Layer 1)**: `#FFFFFF`
- **Border**: `#E5E5E0`
- **Text Primary**: `#18181B`
- **Text Secondary**: `#71717A`

### Functional Accents
Accents are used sparingly for status (Success: `#10B981`, Error: `#EF4444`, Info: `#3B82F6`). The primary action color is the highest contrast neutral (White in dark mode, Black in light mode).

## Typography

The typography strategy relies on **Inter** for all functional application needs, providing high legibility and a systematic feel. **Instrument Serif** is reserved exclusively for "Pyramidion" level moments: landing hero sections, major milestone achievements, or high-level dashboard summaries.

**Geist** is used for labels and small UI metadata to provide a technical, builder-focused nuance. **JetBrains Mono** is the standard for code snippets, data tables, and technical values.

## Layout & Spacing

The system follows a strict **8px grid**. All margins, paddings, and component heights must be multiples of 8 (with 4px and 12px used only for tight internal component spacing).

- **Grid**: 12-column fluid grid for main content areas.
- **Sidebars**: Fixed width of 240px or 280px depending on complexity.
- **Margins**: Desktop uses 32px or 48px page margins. Mobile uses 16px.
- **Density**: High density for data views (Tables/Logs), Medium density for configuration and settings.

## Elevation & Depth

The design system uses **Tonal Layering** rather than traditional shadows. Depth is communicated through increasing brightness of the surface background color.

1.  **Level 0 (Base)**: The canvas color.
2.  **Level 1 (Cards)**: +2% lighter than base. Subtle 1px solid border.
3.  **Level 2 (Modals/Popovers)**: +4% lighter than base. Distinct 1px border.
4.  **Shadows**: When used for floating elements (menus), use a single, highly diffused "Ambient" shadow: `0 8px 32px rgba(0,0,0,0.4)` with no spread.

Glassmorphism is used exclusively for the **Top Navigation Bar** and **Sidebar Background** (12px backdrop blur, 80% opacity) to maintain context while scrolling.

## Shapes

The shape language is precise and professional. A "Soft" (`0.25rem`) radius is the standard for functional elements (buttons, inputs). Larger containers like cards use `0.5rem`.

- **Buttons/Inputs**: 4px (Soft)
- **Cards/Modals**: 8px (Large)
- **Badges**: 2px or Full Pill (depending on context)

## Components

### Buttons
- **Primary**: High contrast (White text on #18181B background in Light Mode). No gradient.
- **Secondary**: Ghost style with a subtle border.
- **Ghost**: No border, background appears only on hover (`#FFFFFF` at 5% opacity).

### Cards
Substantial but clean. Cards use a 1px border (`#27272A`) and no shadow. Titles are always `headline-md`.

### Inputs
Minimalist. Underline-only or subtle 4-sided border. Focus state is a 1px solid primary neutral border—no outer "glow" rings.

### Tables
Builder-first tables. Minimal cell padding, `mono` font for data, and row highlighting on hover. No vertical dividers.

### Navigation
Sidebar-driven. Active states use a subtle vertical indicator bar (2px wide) or a light background tint. Icons should be 20px, light weight.

### Rank System Visuals
Ranks are displayed as monochromatic badges with distinct geometric icons:
- **Explorer**: Single line/Point.
- **Builder**: Square/Foundation.
- **Architect**: Blueprint/Grid pattern.
- **Innovator**: Prism/Refraction.
- **Pyramidion**: Solid Pyramid (The only rank allowed to use a subtle gold or silver tint).

### Motion
Transitions are linear-out/cubic-in.
- **Standard**: 150ms.
- **Page Transitions**: 200ms Fade + 4px Y-axis slide.