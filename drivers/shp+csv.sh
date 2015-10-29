#!/bin/bash

cd ../data
unzip population/barrios_catastrales_wgs84.zip -d tmp
cp population/population.csv /tmp/.

cd tmp

shp2pgsql barrios_catastrales_wgs84.shp > barrios_catastrales.sql
echo 'VACUUM barrios_catastrales_wgs84;' >> barrios_catastrales.sql
psql -U lapsocarte -d lapsocarte -f barrios_catastrales.sql

cat > population.sql <<EOF
CREATE TABLE population(
id serial PRIMARY KEY,
spt_objectid int,
t int,
population float
);

COPY population (spt_objectid,t,population) FROM '/tmp/population.csv' DELIMITER ',' CSV HEADER;
VACUUM population;
EOF
psql -U lapsocarte -d lapsocarte -f population.sql

cd ..
rm -r tmp