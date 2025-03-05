#!/bin/bash

# Changelog fájl neve
CHANGELOG_FILE="CHANGELOG.md"

# Ha már létezik, mentést készítünk róla
if [ -f "$CHANGELOG_FILE" ]; then
    cp "$CHANGELOG_FILE" "${CHANGELOG_FILE}.bak"
fi

# Kezdő fejléc
echo "# 📜 Változásnapló (Changelog)" > "$CHANGELOG_FILE"
echo "" >> "$CHANGELOG_FILE"
echo "Minden jelentős változás ebben a fájlban lesz dokumentálva." >> "$CHANGELOG_FILE"
echo "" >> "$CHANGELOG_FILE"

# Verziók listázása Git tag-ek alapján
VERSIONS=$(git tag --sort=-v:refname)

for VERSION in $VERSIONS; do
    # Verzió dátumának kinyerése
    DATE=$(git log -1 --format=%ai $VERSION | cut -d' ' -f1)
    
    echo "## [$VERSION] - $DATE" >> "$CHANGELOG_FILE"
    echo "### 🆕 Újdonságok és változások" >> "$CHANGELOG_FILE"
    
    # Commit üzenetek listázása az előző verziótól
    PREV_VERSION=$(git describe --tags --abbrev=0 $VERSION^ 2>/dev/null)

    if [ -z "$PREV_VERSION" ]; then
        git log --pretty=format:"- %s" $VERSION >> "$CHANGELOG_FILE"
    else
        git log --pretty=format:"- %s" $PREV_VERSION..$VERSION >> "$CHANGELOG_FILE"
    fi
    
    echo "" >> "$CHANGELOG_FILE"
    echo "---" >> "$CHANGELOG_FILE"
    echo "" >> "$CHANGELOG_FILE"
done

echo "✅ Changelog frissítve: $CHANGELOG_FILE"
