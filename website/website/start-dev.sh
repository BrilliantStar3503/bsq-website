#!/bin/sh
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
cd /Users/christophergarcia/prubsq_website/website/website
exec /usr/local/bin/node node_modules/.bin/next dev --turbopack
