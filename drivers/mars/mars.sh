#!/bin/bash
rm -r /tmp/mars
cd ../../data/ignore/mars
unzip Shape.zip -d /tmp/mars

python ../../../drivers/mars/csv_parser.py
mv output/* /tmp/mars/.
rmdir output

cd /tmp/mars
psql -U mars -d mars -f db.sql
shp2pgsql -d -e -W 'latin1' MARS-Bogota.shp > shape.sql
sed -i "s/mars-bogota/mars_bogota/g" shape.sql
sed -i "s/PRIMARY KEY (gid);/PRIMARY KEY (mars);/g" shape.sql
cat >> shape.sql <<-EOF
ALTER TABLE mars_bogota ALTER COLUMN mars TYPE int;
ALTER TABLE mars_bogota DROP COLUMN gid;
ALTER TABLE mars_bogota DROP COLUMN upz;
ALTER TABLE mars_bogota DROP COLUMN localidad;
ALTER TABLE mars_bogota DROP COLUMN muni;
EOF

psql -U mars -d mars -f shape.sql
psql -U mars -d mars -c "VACUUM;"
