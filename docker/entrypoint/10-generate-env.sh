#!/bin/sh
set -eu

escape_js_value() {
    printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

cat > /usr/share/nginx/html/env.js <<EOF
window.__APP_CONFIG__ = {
    VITE_DOMAIN: "$(escape_js_value "${VITE_DOMAIN:-}")",
    VITE_ORDERS_API_URL: "$(escape_js_value "${VITE_ORDERS_API_URL:-}")"
};
EOF
