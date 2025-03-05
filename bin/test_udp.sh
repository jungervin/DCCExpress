#!/bin/bash

Z21_IP="192.168.1.100"
Z21_PORT=21105
TIMEOUT=1  # sec

echo "📡 Z21 UDP parancs küldése..."
echo -ne '\x04\x00\x40\x00\x24\x00' | socat - UDP:$Z21_IP:$Z21_PORT &


RESPONSE=$(timeout $TIMEOUT nc -u -l -p $Z21_PORT)

if [[ -z "$RESPONSE" ]]; then
    echo "⏳ Timeout: Nem érkezett válasz $TIMEOUT másodpercen belül."
else
    echo "✅ Válasz érkezett: $RESPONSE"
fi
