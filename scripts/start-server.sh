#!/bin/bash
cd $(dirname $0)/..

flask --app app run --debug