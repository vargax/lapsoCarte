#!/bin/bash

cd ../data
unzip population/barrios_catastrales_wgs84.zip -d tmp
cp population/population.csv /tmp/.

cd tmp

shp2pgsql barrios_catastrales_wgs84.shp > barrios_catastrales.sql
psql -U lapsocarte -d lapsocarte -f barrios_catastrales.sql

cat > population.sql <<EOF
CREATE TABLE population(
id serial PRIMARY KEY,
objectid int,
t int,
population float
);

COPY population (objectid,t,population) FROM '/tmp/population.csv' DELIMITER ',' CSV HEADER;
VACUUM population;
EOF
psql -U lapsocarte -d lapsocarte -f population.sql

cat > createTableAs.sql <<EOF
test
EOF

cd ..
rm -r tmp