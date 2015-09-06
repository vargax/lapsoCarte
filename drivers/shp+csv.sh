#!/bin/bash

cd ../data
unzip population/barrios_catastrales_wgs84.zip -d tmp
cp population/population.csv /tmp/.

cd tmp

shp2pgsql barrios_catastrales_wgs84.shp > barrios_catastrales.sql
echo 'VACUUM barrios_catastrales_wgs84;' >> barrios_catastrales.sql
psql -U lapsocarte -d lapsocarte -f barrios_catastrales.sql

cat > population.sql <<EOF
CREATE TABLE population_csv(
id serial PRIMARY KEY,
spt_objectid int,
t int,
population float
);

COPY population_csv (spt_objectid,t,population) FROM '/tmp/population.csv' DELIMITER ',' CSV HEADER;
VACUUM population_csv;
EOF
psql -U lapsocarte -d lapsocarte -f population.sql

cat > createTableAs.sql <<EOF
CREATE TABLE population AS(
    SELECT
      *
    FROM
      public.barrios_catastrales_wgs84,
      public.population_csv
    WHERE
      barrios_catastrales_wgs84.objectid = population_csv.spt_objectid
);
VACUUM population;
ALTER TABLE population ADD PRIMARY KEY(id);

DROP TABLE public.barrios_catastrales_wgs84;
DROP TABLE public.population_csv;
EOF
psql -U lapsocarte -d lapsocarte -f createTableAs.sql

cd ..
rm -r tmp