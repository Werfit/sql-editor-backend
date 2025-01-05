#!/bin/sh

echo "Running migrations..."
npx typeorm migration:run -d dist/database/data-source.js

exec "$@"