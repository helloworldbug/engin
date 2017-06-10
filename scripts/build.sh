#!/usr/bin/env bash

SCRIPT_PATH="$( cd "$(dirname "${0}")" ; pwd -P )"
BASE_PATH=$SCRIPT_PATH/..
SCRIPT_NAME=`basename "$0"`
NODE_MOD_PATH=$BASE_PATH/node_modules

TASK="release"

if [ ! -d "$NODE_MOD_PATH" ]; then
	echo "node_modules not installed. run npm install..."
	cd "$BASE_PATH" && npm install
fi

if [ "$1" != "" ];then
	TASK=$1
fi

if [ "$TASK" != "release" -a "$TASK" != "develop" ]; then
    echo "Usage: $SCRIPT_NAME release|develop"
    exit 255
fi

RET=0
OPTIONS="-d dist/$TASK"
if [ "$TASK" == "release" ]; then
    OPTIONS="$OPTIONS -o Y -z Y"
else
    OPTIONS="$OPTIONS -o N -z N"
fi

echo "run gulp task $TASK..."
CMD="$NODE_MOD_PATH/gulp/bin/gulp.js scss -s main_css $OPTIONS"
echo "\n*** RUN CMD:$CMD"
bash -c "$CMD"
CMD="$NODE_MOD_PATH/gulp/bin/gulp.js js -s render_js $OPTIONS"
echo "\n*** RUN CMD:$CMD"
bash -c "$CMD"
RET=$?
echo "run gulp task $TASK end. status = $RET"

exit $RET
