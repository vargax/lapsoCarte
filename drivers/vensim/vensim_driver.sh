#!/bin/bash
rm -r /tmp/lapsocarte/vensim
cd data
unzip Shape.zip -d /tmp/lapsocarte/vensim

python ../csv_parser.py
mv mars.sql /tmp/mars/.

cd /tmp/mars
psql -U mars -d mars -f mars.sql

shp2pgsql -d -e -W 'latin1' MARS-Bogota.shp > shape.sql
sed -i "s/mars-bogota/mars_bogota/g" shape.sql
sed -i "s/PRIMARY KEY (gid);/PRIMARY KEY (mars);/g" shape.sql
cat >> shape.sql <<-EOF
ALTER TABLE mars_bogota ALTER COLUMN mars TYPE int;
ALTER TABLE mars_bogota DROP COLUMN gid;
ALTER TABLE mars_bogota DROP COLUMN upz;
ALTER TABLE mars_bogota DROP COLUMN localidad;
ALTER TABLE mars_bogota DROP COLUMN muni;

ALTER TABLE mars_bogota RENAME TO shape;
ALTER TABLE shape RENAME COLUMN mars TO gid;
EOF

psql -U mars -d mars -f shape.sql
psql -U mars -d mars -c "VACUUM;"
