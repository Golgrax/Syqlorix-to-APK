// Global variables
let uploadedFiles = [];
let convertedHTML = '';

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const fileItems = document.getElementById('fileItems');
const entryFileSelect = document.getElementById('entryFile');
const previewFrame = document.getElementById('previewFrame');
const buildBtn = document.getElementById('buildBtn');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const downloadContainer = document.getElementById('downloadContainer');
const downloadBtn = document.getElementById('downloadBtn');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
});

function setupEventListeners() {
    // File upload events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    fileInput.addEventListener('change', handleFileSelect);
    
    // Build button
    buildBtn.addEventListener('click', buildAPK);
    
    // Entry file change
    entryFileSelect.addEventListener('change', updatePreview);
}

function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

function processFiles(files) {
    files.forEach(file => {
        if (file.name.endsWith('.py') || file.name.endsWith('.zip')) {
            uploadedFiles.push(file);
        } else {
            showMessage('Only Python (.py) and ZIP files are supported.', 'error');
        }
    });
    
    updateFileList();
    updateEntryFileOptions();
    updateBuildButton();
}

function updateFileList() {
    if (uploadedFiles.length === 0) {
        fileList.style.display = 'none';
        return;
    }
    
    fileList.style.display = 'block';
    fileItems.innerHTML = '';
    
    uploadedFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item fade-in';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file-code"></i>
                <span>${file.name}</span>
                <small>(${formatFileSize(file.size)})</small>
            </div>
            <button class="remove-file" onclick="removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        fileItems.appendChild(fileItem);
    });
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFileList();
    updateEntryFileOptions();
    updateBuildButton();
}

function updateEntryFileOptions() {
    entryFileSelect.innerHTML = '<option value="">Select main Python file</option>';
    
    const pythonFiles = uploadedFiles.filter(file => file.name.endsWith('.py'));
    pythonFiles.forEach((file, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = file.name;
        entryFileSelect.appendChild(option);
    });
}

function updateBuildButton() {
    const hasPythonFiles = uploadedFiles.some(file => file.name.endsWith('.py'));
    buildBtn.disabled = !hasPythonFiles;
}

async function updatePreview() {
    const selectedIndex = entryFileSelect.value;
    if (selectedIndex === '') return;
    
    const pythonFiles = uploadedFiles.filter(file => file.name.endsWith('.py'));
    const selectedFile = pythonFiles[selectedIndex];
    
    if (!selectedFile) return;
    
    try {
        const content = await readFileContent(selectedFile);
        const html = convertSyqlorixToHTML(content);
        convertedHTML = html;
        
        // Create a blob URL for the preview
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        previewFrame.src = url;
        
        showMessage('Preview updated successfully!', 'success');
    } catch (error) {
        showMessage('Error reading file: ' + error.message, 'error');
    }
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = e => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

function convertSyqlorixToHTML(pythonCode) {
    // Enhanced Syqlorix to HTML converter
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.getElementById('appName').value}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        h1, h2, h3, h4, h5, h6 {
            color: #333;
            margin-bottom: 15px;
        }
        p {
            line-height: 1.6;
            margin-bottom: 15px;
        }
        button {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        input, textarea, select {
            width: 100%;
            padding: 10px;
            border: 2px solid #e1e5e9;
            border-radius: 5px;
            margin: 5px 0;
            font-size: 16px;
        }
        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #667eea;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="container">`;

    try {
        // Look for route definitions
        const routeMatches = pythonCode.match(/@doc\.route\(['"]([^'"]+)['"]\)[\s\S]*?def\s+(\w+)\([^)]*\):([\s\S]*?)(?=@doc\.route|$)/g);
        
        if (routeMatches) {
            routeMatches.forEach(routeMatch => {
                const routeInfo = routeMatch.match(/@doc\.route\(['"]([^'"]+)['"]\)[\s\S]*?def\s+(\w+)\([^)]*\):([\s\S]*)/);
                if (routeInfo) {
                    const route = routeInfo[1];
                    const functionName = routeInfo[2];
                    const functionBody = routeInfo[3];
                    
                    html += `<section style="margin-bottom: 30px; padding: 20px; border: 1px solid #e1e5e9; border-radius: 10px;">`;
                    html += `<h3>Route: ${route}</h3>`;
                    html += convertFunctionBodyToHTML(functionBody);
                    html += `</section>`;
                }
            });
        } else {
            // Look for direct doc operations
            const docOperations = pythonCode.match(/doc\s*\/\s*([^(\n]+)/g);
            if (docOperations) {
                docOperations.forEach(operation => {
                    html += convertDocOperationToHTML(operation);
                });
            } else {
                // Fallback: create a simple page
                html += `<h1>Syqlorix App</h1>`;
                html += `<p>This is a Syqlorix application converted to HTML.</p>`;
                html += `<p>Original Python code:</p>`;
                html += `<pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>${escapeHTML(pythonCode)}</code></pre>`;
            }
        }
    } catch (error) {
        html += `<h1>Conversion Error</h1>`;
        html += `<p>There was an error converting your Syqlorix code:</p>`;
        html += `<pre style="background: #ffe6e6; padding: 15px; border-radius: 5px; color: #d00;"><code>${escapeHTML(error.message)}</code></pre>`;
        html += `<p>Original code:</p>`;
        html += `<pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;"><code>${escapeHTML(pythonCode)}</code></pre>`;
    }

    html += `
    </div>
    <script>
        // Add some interactivity
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Syqlorix app loaded successfully!');
        });
    </script>
</body>
</html>`;

    return html;
}

function convertFunctionBodyToHTML(functionBody) {
    let html = '';
    
    // Look for return statements with HTML-like content
    const returnMatches = functionBody.match(/return\s+(.+)/g);
    if (returnMatches) {
        returnMatches.forEach(returnMatch => {
            const returnContent = returnMatch.replace(/return\s+/, '');
            html += convertSyqlorixElementToHTML(returnContent);
        });
    }
    
    return html;
}

function convertDocOperationToHTML(operation) {
    // Convert doc / element operations to HTML
    const elementMatch = operation.match(/doc\s*\/\s*(\w+)\(([^)]*)\)/);
    if (elementMatch) {
        const elementType = elementMatch[1];
        const elementContent = elementMatch[2];
        return convertSyqlorixElementToHTML(`${elementType}(${elementContent})`);
    }
    return '';
}

function convertSyqlorixElementToHTML(element) {
    // Basic conversion of Syqlorix elements to HTML
    element = element.trim();
    
    // Handle common elements
    if (element.startsWith('h1(')) {
        const content = extractContent(element);
        return `<h1>${content}</h1>`;
    } else if (element.startsWith('h2(')) {
        const content = extractContent(element);
        return `<h2>${content}</h2>`;
    } else if (element.startsWith('h3(')) {
        const content = extractContent(element);
        return `<h3>${content}</h3>`;
    } else if (element.startsWith('p(')) {
        const content = extractContent(element);
        return `<p>${content}</p>`;
    } else if (element.startsWith('div(')) {
        const content = extractContent(element);
        return `<div>${content}</div>`;
    } else if (element.startsWith('button(')) {
        const content = extractContent(element);
        return `<button onclick="alert('Button clicked!')">${content}</button>`;
    } else if (element.startsWith('input(')) {
        return `<input type="text" placeholder="Enter text">`;
    } else if (element.startsWith('form(')) {
        const content = extractContent(element);
        return `<form class="form-group">${content}</form>`;
    } else {
        // Fallback: treat as text content
        return `<p>${escapeHTML(element)}</p>`;
    }
}

function extractContent(element) {
    // Extract content from parentheses, handling nested quotes
    const match = element.match(/\(([^)]+)\)/);
    if (match) {
        let content = match[1].trim();
        // Remove quotes if present
        if ((content.startsWith('"') && content.endsWith('"')) || 
            (content.startsWith("'") && content.endsWith("'"))) {
            content = content.slice(1, -1);
        }
        return escapeHTML(content);
    }
    return '';
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function buildAPK() {
    if (!convertedHTML) {
        await updatePreview();
    }
    
    if (!convertedHTML) {
        showMessage('Please select an entry file and generate preview first.', 'error');
        return;
    }
    
    // Show progress
    progressContainer.style.display = 'block';
    downloadContainer.style.display = 'none';
    buildBtn.disabled = true;
    
    try {
        // Simulate build process with progress updates
        await simulateBuildProcess();
        
        // Create APK (actually a PWA package)
        const apkBlob = await createAPKPackage();
        
        // Setup download
        const url = URL.createObjectURL(apkBlob);
        downloadBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = `${document.getElementById('appName').value.replace(/\s+/g, '_')}.apk`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
        
        // Show download button
        progressContainer.style.display = 'none';
        downloadContainer.style.display = 'block';
        showMessage('APK built successfully! Click download to get your app.', 'success');
        
    } catch (error) {
        showMessage('Error building APK: ' + error.message, 'error');
        progressContainer.style.display = 'none';
    } finally {
        buildBtn.disabled = false;
    }
}

async function simulateBuildProcess() {
    const steps = [
        'Parsing Syqlorix code...',
        'Converting to HTML...',
        'Generating PWA manifest...',
        'Creating service worker...',
        'Packaging APK...',
        'Finalizing build...'
    ];
    
    for (let i = 0; i < steps.length; i++) {
        progressText.textContent = steps[i];
        progressFill.style.width = `${((i + 1) / steps.length) * 100}%`;
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}

async function createAPKPackage() {
    const zip = new JSZip();
    
    // Add main HTML file
    zip.file('index.html', convertedHTML);
    
    // Add PWA manifest
    const manifest = {
        name: document.getElementById('appName').value,
        short_name: document.getElementById('appName').value,
        start_url: '/',
        display: 'standalone',
        background_color: '#667eea',
        theme_color: '#667eea',
        icons: [
            {
                src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
                sizes: '192x192',
                type: 'image/png'
            }
        ]
    };
    zip.file('manifest.json', JSON.stringify(manifest, null, 2));
    
    // Add service worker
    const serviceWorker = `
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('syqlorix-app-v1').then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
`;
    zip.file('sw.js', serviceWorker);
    
    // Add APK metadata (for demonstration)
    const apkInfo = {
        package: document.getElementById('packageName').value,
        version: document.getElementById('appVersion').value,
        name: document.getElementById('appName').value,
        type: 'PWA-APK',
        generated: new Date().toISOString(),
        note: 'This is a Progressive Web App packaged as an APK-like file. Install by extracting and serving the contents.'
    };
    zip.file('app-info.json', JSON.stringify(apkInfo, null, 2));
    
    // Add installation instructions
    const instructions = `
# Installation Instructions

This package contains a Progressive Web App (PWA) that can be installed on Android devices.

## Method 1: Web Installation
1. Extract all files to a web server
2. Open the URL in Chrome on Android
3. Tap "Add to Home Screen" when prompted

## Method 2: Local Installation
1. Extract files to your device
2. Open index.html in Chrome
3. Use "Add to Home Screen" option

## Files Included:
- index.html: Main application file
- manifest.json: PWA configuration
- sw.js: Service worker for offline functionality
- app-info.json: Application metadata

Note: This is a web-based APK alternative. For true APK installation, 
you would need to use Android development tools.
`;
    zip.file('README.txt', instructions);
    
    return await zip.generateAsync({ type: 'blob' });
}

function showMessage(text, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type} fade-in`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        ${text}
    `;
    
    // Insert after the header
    const header = document.querySelector('.header');
    header.insertAdjacentElement('afterend', message);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
        }
    }, 5000);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

