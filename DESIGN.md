---
name: Clean Financial Guide
colors:
  surface: '#f8faf8'
  surface-dim: '#d9dad9'
  surface-bright: '#f8faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f2'
  surface-container: '#edeeec'
  surface-container-high: '#e7e8e7'
  surface-container-highest: '#e1e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#404947'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#f0f1ef'
  outline: '#707977'
  outline-variant: '#bfc8c5'
  surface-tint: '#30675f'
  primary: '#0b4a43'
  on-primary: '#ffffff'
  primary-container: '#2a625a'
  on-primary-container: '#a3dbd1'
  inverse-primary: '#99d1c7'
  secondary: '#54615b'
  on-secondary: '#ffffff'
  secondary-container: '#d7e6dd'
  on-secondary-container: '#5a6761'
  tertiary: '#633526'
  on-tertiary: '#ffffff'
  tertiary-container: '#7f4c3b'
  on-tertiary-container: '#ffc3b0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b4eee3'
  primary-fixed-dim: '#99d1c7'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#134f48'
  secondary-fixed: '#d7e6dd'
  secondary-fixed-dim: '#bbcac1'
  on-secondary-fixed: '#111e19'
  on-secondary-fixed-variant: '#3c4a43'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#fbb7a1'
  on-tertiary-fixed: '#341005'
  on-tertiary-fixed-variant: '#693a2a'
  background: '#f8faf8'
  on-background: '#191c1b'
  surface-variant: '#e1e3e1'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Outfit
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style

The design system is built for a premium editorial finance platform that balances technical precision with high-end publishing aesthetics. The brand personality is authoritative yet modern, stripping away the traditional "stuffy" finance tropes in favor of a **Neo-Brutalist Minimalism**. 

The goal is to evoke a sense of structural integrity and clarity. By utilizing a high-contrast palette and architectural geometry, the UI commands attention and establishes immediate trust. It draws inspiration from modern fintech leaders and prestige print journals, utilizing stark lines and generous whitespace to make complex financial data feel navigable and sophisticated.

## Colors

The palette is anchored by **Deep Pine (#2A625A)**, a sophisticated green that symbolizes growth and stability. This is set against a **Warm Off-White (#FDFCF8)** background to reduce eye strain and provide a more "paper-like" editorial feel compared to pure white.

### Functional Accents
To assist in content categorization (SEO-driven navigation), three soft accents are used:
- **Mint:** Dedicated to Investing and wealth-building content.
- **Lilac:** Dedicated to Saving, budgeting, and personal finance habits.
- **Peach:** Dedicated to Taxes, regulation, and administrative guidance.

All interactive elements and structural borders utilize the **Text Color (#121212)** to maintain a high-contrast, "ink-on-paper" aesthetic.

## Typography

Typography is the primary vehicle for the brand’s voice. 

- **Headlines:** We use **Space Grotesk (Bold)**. Its geometric, slightly technical character provides an "engineering" feel to financial data. Large display sizes should use tight leading and negative letter spacing to create a cohesive visual block.
- **Body:** We use **Outfit**. Its wide apertures and modern construction ensure high readability for long-form SEO articles. 
- **Labels:** Meta-information (dates, categories, tags) should be set in Outfit Medium, uppercase, with slight letter spacing to differentiate it from narrative text.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy to mirror the structured nature of a financial ledger or newspaper. 

- **Desktop:** 12-column grid with a 1280px max-width. Columns are separated by 24px gutters.
- **Mobile:** Single column with 16px side margins.
- **Rhythm:** We use an 8px base unit. Vertical rhythm is critical; spacing between sections should be aggressive (`lg` or `xl`) to create a "gallery" feel for the content.

Content should be centered with wide horizontal margins to keep the reading line length optimal (max 720px for article bodies).

## Elevation & Depth

This design system eschews traditional soft shadows and blurs. Depth is conveyed through **Hard-Edged Offsets** and **Stark Outlines**.

1.  **Borders:** Every card, input, and container uses a 1px solid border in `#121212`. 
2.  **Shadows:** Shadows are not diffused. They are solid blocks of `#121212` offset by 4px or 8px. This "Neo-Brutalist" approach gives the UI a tactile, physical presence, suggesting that elements are "slabs" stacked on the page.
3.  **Tonal Layers:** Deep Pine (#2A625A) can be used as a background for high-impact sections, with text switching to the background color (#FDFCF8) for maximum legibility.

## Shapes

The shape language is strictly **Sharp (0px radius)**. 

Every element—from primary buttons and form fields to article cards and imagery—must maintain perfectly square corners. This reinforces the "Financial Guide" aspect, suggesting precision, accuracy, and an uncompromising editorial standard. Curves are prohibited within structural UI components to maintain the stark, architectural aesthetic.

## Components

### Buttons
- **Primary:** Solid Deep Pine background, white text, 1px black border, 4px black hard-shadow. On hover, the shadow disappears and the button "depresses" (shifts 4px down and right).
- **Secondary:** Transparent background, 1px black border, no shadow. 

### Cards
- White surface, 1px black border, 4px black hard-shadow. 
- Category chips (Mint, Lilac, or Peach) should be placed in the top-left of the card with a 1px border.

### Input Fields
- 1px black border, 0px radius. Use Outfit 16px for placeholder text.
- Focus state: The border weight increases to 2px or the background shifts to the light Mint accent.

### Lists
- Financial data lists should use a horizontal 1px rule (divider) between items.
- Bullet points should be replaced by small solid squares (4px x 4px) to match the geometric theme.

### Featured Quote / Callout
- Large-scale Space Grotesk text, left-aligned, with a thick 8px Deep Pine vertical border on the left side to interrupt the reading flow and highlight key insights.