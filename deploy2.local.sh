#!/bin/bash

source ./read-env.sh
source ./log.sh # NOTE: See also https://opensource.com/article/20/6/bash-source-command

LOCAL_TARGET_PATH_BUILD_DIR=$(read_env LOCAL_TARGET_PATH_BUILD_DIR .env.prod.local)

good '-- LOCAL DEPLOY STARTED 🛫' &&

srcDir=$PWD/

rsync -av --delete build/ $LOCAL_TARGET_PATH_BUILD_DIR &&
# rsync -r $srcDir/build/index.html $LOCAL_TARGET_PATH_BUILD_DIR &&

good '-- LOCAL DEPLOY COMPLETED 🛬'
