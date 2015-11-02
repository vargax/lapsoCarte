#!/usr/bin/env bash

cd ../data/ignore/mars
unzip Shape.zip -d /tmp/mars
cp datos.csv /tmp/mars/.

cd /tmp/mars

shp2pgsql -W "latin1" MARS-Bogota.shp > mars-Bogota.sql
echo 'VACUUM mars-bogota;' >> mars-Bogota.sql
psql -U mars -d mars -f mars-Bogota.sql

cat > data.sql <<EOF
CREATE TABLE data(
id serial PRIMARY KEY,
spt_objectid int,
t int,
population float
);

COPY population (spt_objectid,t,population) FROM '/tmp/population.csv' DELIMITER ',' CSV HEADER;
VACUUM population;
EOF