# Syqlorix → APK Converter

A modern, web-based tool for converting Syqlorix Python applications to Android APK files. This tool provides a user-friendly interface for uploading Syqlorix code, previewing the converted HTML, and generating downloadable APK packages.

## Features

- **Drag & Drop Upload**: Easy file upload with support for Python files and ZIP archives
- **Live Preview**: See how your Syqlorix code will look as a web app
- **APK Generation**: Convert your Syqlorix apps to installable Android packages
- **Modern UI**: Beautiful, responsive design with smooth animations
- **PWA Support**: Generated APKs are actually Progressive Web Apps for better compatibility

## How It Works

1. **Upload**: Drop your Syqlorix Python files or ZIP archives
2. **Configure**: Set your app name, package name, and version
3. **Preview**: See a live preview of your converted app
4. **Build**: Generate the APK package
5. **Download**: Get your installable Android app

## Supported File Types

- `.py` - Syqlorix Python files
- `.zip` - ZIP archives containing Syqlorix projects

## Technical Details

The converter works by:

1. Parsing Syqlorix Python code to extract UI elements
2. Converting Syqlorix syntax to standard HTML/CSS/JavaScript
3. Creating a Progressive Web App (PWA) package
4. Wrapping the PWA in an APK-like structure for easy installation

## Installation & Deployment

### Local Development

```bash
# Clone or download the project
cd syqlorix-apk-converter

# Install dependencies (optional, for development server)
npm install

# Start development server
npm run dev
```

### Vercel Deployment

This project is ready for deployment on Vercel:

1. Push the code to a GitHub repository
2. Connect the repository to Vercel
3. Deploy with default settings (no build configuration needed)

### Manual Deployment

Simply upload all files to any web server that can serve static files.

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Limitations

- The generated "APK" is actually a PWA package
- For true APK installation, users need to extract and serve the files
- Complex Syqlorix features may not convert perfectly
- No server-side functionality in the converted app

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see LICENSE file for details.

## About Syqlorix

Syqlorix is a hyper-minimalist Python micro-framework for building web applications. Learn more at [syqlorix.github.io](https://syqlorix.github.io).

