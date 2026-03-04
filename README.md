# VHCC Email Signature Generator

A web application for generating professional email signatures for Virginia Highlands Community College staff.

## Project Structure

```
vhcc-signature-generator/
├── index.html              # Main HTML file with form and layout
├── assets/
│   ├── styles.css         # Custom CSS styles
│   ├── app.js             # JavaScript application logic
│   ├── VHCC-logo.png      # Light theme logo
│   ├── VHCC-logo-white.png # Dark theme logo
│   └── logo.png           # Signature logo
└── README.md              # This file
```

## Code Organization

### `index.html`

- Contains the semantic HTML structure
- Form fields for user input
- Preview container
- Help section with instructions
- Uses Tailwind CSS for styling

### `assets/styles.css`

- Custom CSS styles
- Tooltip styling
- Help icon styling
- Dark mode styles

### `assets/app.js`

The JavaScript is organized into three main modules:

#### **ThemeManager**

Handles light/dark theme toggling

- `init()` - Initialize theme system
- `initTheme()` - Load saved theme preference
- `toggleTheme()` - Switch between themes

#### **HelpManager**

Manages the expandable help section

- `init()` - Set up help section
- `toggleHelp()` - Expand/collapse help content

#### **SignatureGenerator**

Core signature generation functionality

- `init()` - Initialize form and handlers
- `getFormData()` - Extract form values
- `buildSignatureHTML()` - Generate signature HTML
- `generateSignature()` - Create and display signature
- `copySignature()` - Copy signature to clipboard
- `showMessageBox()` - Show success message

## Making Changes

### Updating Styles

Edit `assets/styles.css` for custom styles. The project uses Tailwind CSS for utility classes.

### Modifying Signature Template

Update the `buildSignatureHTML()` method in `assets/app.js` to change the signature layout or content.

### Adding Form Fields

1. Add the input field to `index.html`
2. Add the field to `getFormData()` in `assets/app.js`
3. Update `buildSignatureHTML()` to use the new field

### Changing Default Values

Edit the `value` attributes in the form inputs in `index.html`.

## Features

- 🌓 Dark mode support with preference persistence
- 📋 One-click clipboard copy
- 📱 Responsive design
- ♿ Accessible UI with proper ARIA labels
- 💾 Local storage for theme preferences
- 📖 Built-in instructions for adding signature to Outlook

## Browser Compatibility

Works in all modern browsers that support:

- ES6 JavaScript
- CSS Grid/Flexbox
- LocalStorage API
- execCommand for clipboard operations
