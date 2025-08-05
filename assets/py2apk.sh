#!/bin/bash
# Run inside termux, pydroid3, or colab
set -e
APP_ENTRY="APP_ENTRY_PLACEHOLDER"      # will be replaced
FALLBACK="FALLBACK_PLACEHOLDER"

echo "=== Syqlorix → Android  ==="
pip install syqlorix pywebview
pip install buildozer cython  # if building locally

# create minimal main.py for android
cat > main.py <<EOF
import os, threading, time, shutil
from syqlorix import Syqlorix, Request
import webview, json, glob

# copy bundled files to writable folder
HOME = os.getcwd()
DATA_DIR = os.path.join(HOME, 'data')
if not os.path.exists(DATA_DIR):
    os.mkdir(DATA_DIR)
    for f in glob.glob('*'):
        if os.path.isfile(f) and f != 'main.py':
            shutil.copy(f, DATA_DIR)

# start syqlorix dev server in a thread
exec(open(os.path.join(DATA_DIR, '$APP_ENTRY')).read())  # loads doc variable
threading.Thread(target=doc.run, daemon=True, kwargs={'file_path': os.path.join(DATA_DIR, '$APP_ENTRY'), 'host':'127.0.0.1', 'port': 5000}).start()
time.sleep(2)  # wait for server

# open webview pointing to localhost
webview.create_window('Syqlorix App', 'http://127.0.0.1:5000')
webview.start()
EOF

echo "✅ Ready for Buildozer:"
echo "   buildozer init && buildozer -v android debug"
echo "   OR upload this folder to GitHub Actions for CI/CD"