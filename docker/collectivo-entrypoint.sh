#!/bin/sh

ROOT_DIR=/usr/share/nginx/html
# ROOT_DIR=../dist

# Replace env vars in JavaScript files
echo "Replacing env constants in JS"
ls -lah $ROOT_DIR
for file in $ROOT_DIR/assets/*.js* $ROOT_DIR/index.html;
do
  echo "Processing $file ...";

  sed -i 's|VITE_APP_API_value|'${VITE_APP_API}'|g' $file 
  sed -i 's|VITE_KEYCLOAK_URL_value|'${VITE_KEYCLOAK_URL}'|g' $file

done
