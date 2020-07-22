#!/bin/bash

DIST_FOLDER=../vk-dist

npm test &&

mkdir -p $DIST_FOLDER &&

cp -r public/* $DIST_FOLDER/ &&

babel \
src/utils.js \
src/app.js \
src/quiz.js \
src/places.js \
-o $DIST_FOLDER/app.js &&

uglifyjs \
src/lib/socket.io.slim.js \
src/lib/sweetalert2.min.js \
src/lib/vk-bridge.min.js \
src/lib/1-lightgallery.min.js \
src/lib/2-lg-zoom.min.js \
src/lib/3-lg-autoplay.min.js \
$DIST_FOLDER/app.js \
-c drop_console=true,toplevel=true -m toplevel=true -o $DIST_FOLDER/app.min.js &&

rm $DIST_FOLDER/app.js &&

html-minifier --collapse-whitespace --remove-comments \
src/header.html \
src/main.html \
src/quiz.html \
src/places.html \
src/loading.html \
src/footer.html \
-o $DIST_FOLDER/index.html &&

cleancss \
src/lib/bootstrap.min.css \
src/lib/sweetalert2.min.css \
src/lib/icomoon.css \
src/lib/animate.min.css \
src/lib/lightgallery.min.css \
src/custom.css \
-o $DIST_FOLDER/custom.min.css --skip-rebase
