#!/bin/bash

cd ../../data/ignore/mars
unzip Shape.zip -d /tmp/mars

python ../../../drivers/mars/csv_parser.py
mv output/* /tmp/mars/.
rmdir output

cd /tmp/mars
psql -U mars -d mars -f db.sql
shp2pgsql MARS-Bogota.shp > shape.sql
psql -U mars -d mars -f shape.sql

rm -r /tmp/mars
