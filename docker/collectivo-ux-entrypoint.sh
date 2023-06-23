#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

# Replace env vars in JavaScript files
api_url=$(echo "$VITE_API_URL" | sed 's/\//\\\//g') 
for file in $ROOT_DIR/assets/index*.js* $ROOT_DIR/index.html;
do
  echo "Processing $file ...";

  sed -i "s/VITE_API_URL_value/$api_url/g" $file 
  sed -i 's|VITE_KEYCLOAK_URL_value|'${VITE_KEYCLOAK_URL}'|g' $file

done
