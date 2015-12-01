#!/bin/bash
rm -r /tmp/demo
cd data
unzip shape.zip -d /tmp/demo

python ../csv_parser.py
mv demo.sql /tmp/demo

cd /tmp/demo
psql -U demo -d demo -f demo.sql

shp2pgsql -d -e shape.shp > shape.sql
sed -i "s/PRIMARY KEY (gid);/PRIMARY KEY (id);/g" shape.sql
cat >> shape.sql <<-EOF
ALTER TABLE shape ALTER COLUMN id TYPE int;
ALTER TABLE shape DROP COLUMN gid;

ALTER TABLE shape RENAME COLUMN id TO where_column;
EOF

psql -U demo -d demo -f shape.sql
psql -U demo -d demo -c "VACUUM;"