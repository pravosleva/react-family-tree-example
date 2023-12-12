#!/bin/bash

source ./read-env.sh
source ./log.sh # NOTE: See also https://opensource.com/article/20/6/bash-source-command

PROD_TARGET_PATH_BUILD_DIR=$(read_env PROD_TARGET_PATH_BUILD_DIR .env.prod."$1")

good '-- REMOTE DEPLOY STARTED 🛫' &&

rsync -av --delete dist.staging/ $PROD_TARGET_PATH_BUILD_DIR &&

good '-- REMOTE DEPLOY COMPLETED 🛬'
