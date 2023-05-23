#!/bin/bash
cd $(dirname $0)/..

flask --app server/main.py run --debug