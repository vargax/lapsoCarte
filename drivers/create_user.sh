#!/bin/bash

cd /tmp
su postgres <<EOF
psql -c "CREATE ROLE $1 PASSWORD '$1' LOGIN;"
createdb -O $1 $1
psql -c "CREATE EXTENSION postgis; CREATE EXTENSION postgis_topology;" $1
EOF
