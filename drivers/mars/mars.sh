#!/bin/bash

cd ../../data/ignore/mars
unzip Shape.zip -d /tmp/mars

python ../../../drivers/mars/csv_parser.py
mv output/* /tmp/mars/.

cd /tmp/mars
