#!/bin/sh

# error on first error
set -e

echo "=== Running Format Check With Prettier ==="
npm run format:check

echo "=== Running Linter ==="
npm run lint

echo "=== Running Svelte Check ===" 
npm run check

echo "=== Running Tests ==="
npm run test

echo "\n=== All Checks Pass ===\n"
