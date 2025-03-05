#!/bin/bash

Z21_IP="192.168.1.70"
Z21_PORT=21105
TIMEOUT=1  # sec

echo "Z21 UDP GET SERIAL NUMBER: $Z21_IP:$Z21_PORT"
echo -ne '\x04\x00\x10\x00' | socat - UDP:$Z21_IP:$Z21_PORT &


RESPONSE=$(timeout $TIMEOUT nc -u -l -p $Z21_PORT)

if [[ -z "$RESPONSE" ]]; then
    echo "⏳ Timeout: $TIMEOUT sec."
else
    echo "✅ RESPONSE: $RESPONSE"
fi
