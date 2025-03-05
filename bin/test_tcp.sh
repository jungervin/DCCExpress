#!/bin/bash

TCP_IP="192.168.1.137"
TCP_PORT=2560
TIMEOUT=1
COMMAND="<s>"

echo "📡 TCP parancs küldése: $COMMAND → $TCP_IP:$TCP_PORT"


RESPONSE=$(echo -ne "$COMMAND" | timeout $TIMEOUT nc $TCP_IP $TCP_PORT)

if [[ -z "$RESPONSE" ]]; then
    echo "⏳ Timeout: Nem érkezett válasz $TIMEOUT másodpercen belül."
else
    echo "✅ Válasz érkezett: $RESPONSE"
fi
