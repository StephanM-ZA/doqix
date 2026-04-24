#!/bin/bash
# bump-version.sh — Bump website version, update cache-bust strings, tag, and push.
# Usage: ./scripts/bump-version.sh [patch|minor|major] "Tag message"
# Default: patch

set -euo pipefail

BUMP_TYPE="${1:-patch}"
TAG_MSG="${2:-Version bump}"

# Get current version from latest web-v* tag
CURRENT=$(git tag -l 'web-v*' --sort=-version:refname | head -1 | sed 's/web-v//')
if [ -z "$CURRENT" ]; then
  echo "Error: No existing web-v* tag found."
  exit 1
fi

IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

case "$BUMP_TYPE" in
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  patch) PATCH=$((PATCH + 1)) ;;
  *) echo "Usage: $0 [patch|minor|major] \"message\""; exit 1 ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
echo "Bumping: ${CURRENT} -> ${NEW_VERSION}"

# Update all ?v= cache-bust strings in design/ and site/
find design/ site/ -name '*.html' -exec sed -i '' "s/?v=${CURRENT}/?v=${NEW_VERSION}/g" {} +
echo "Updated cache-bust strings in HTML files."

# Update CLAUDE.md current version reference
sed -i '' "s/web-v${CURRENT}/web-v${NEW_VERSION}/g" CLAUDE.md
echo "Updated CLAUDE.md version reference."

# Stage, commit, tag
git add design/ site/ CLAUDE.md
git commit -m "chore(website): bump cache-bust versions to ${NEW_VERSION}

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"

git tag -a "web-v${NEW_VERSION}" -m "${TAG_MSG}"

echo ""
echo "Done: web-v${NEW_VERSION}"
echo "Run 'git push origin main --tags' to deploy."
