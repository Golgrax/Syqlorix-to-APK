# Deployment Instructions for Vercel

This document provides step-by-step instructions for deploying the Syqlorix APK Converter to Vercel.

## Prerequisites

- A GitHub account
- A Vercel account (free tier is sufficient)
- Git installed on your local machine

## Step 1: Prepare Your Repository

1. Create a new GitHub repository (e.g., `syqlorix-apk-converter`)
2. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/syqlorix-apk-converter.git
   cd syqlorix-apk-converter
   ```

3. Copy all the project files to your repository:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `package.json`
   - `README.md`
   - `DEPLOYMENT.md` (this file)

4. Commit and push the files:
   ```bash
   git add .
   git commit -m "Initial commit: Syqlorix APK Converter"
   git push origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (leave empty or use a single dot)
   - **Build Command**: Leave empty (no build required)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install` (optional)

5. Click "Deploy"

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Link to existing project? No
   - Project name: `syqlorix-apk-converter`
   - Directory: `./` (current directory)

## Step 3: Configure Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click on "Domains"
3. Add a custom domain if desired

## Project Structure

```
syqlorix-apk-converter/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── package.json        # Node.js package configuration
├── README.md           # Project documentation
└── DEPLOYMENT.md       # This deployment guide
```

## Environment Variables

This project doesn't require any environment variables for basic functionality.

## Build Configuration

Since this is a static website, no build process is required. Vercel will serve the files directly.

## Troubleshooting

### Common Issues

1. **404 Error**: Ensure `index.html` is in the root directory
2. **CSS/JS Not Loading**: Check file paths in `index.html`
3. **Build Fails**: This project doesn't need a build step, ensure build command is empty

### Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Ensure all files are committed to your repository
3. Verify the project structure matches the expected layout

## Post-Deployment

After successful deployment:
1. Test all functionality on the live site
2. Verify file upload works
3. Test APK generation and download
4. Check responsive design on mobile devices

Your Syqlorix APK Converter should now be live and accessible via your Vercel URL!

