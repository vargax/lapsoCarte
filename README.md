LapsoCarte is a web-based visual tool to interact with time-space referenced data. It is based on:

- *PostGIS* as a database engine.
- *iojs* as a server-side platform.
- *ECMAScript 6* as a client-side language.

LapsoCarte also uses:

- *GeoTabulaDB* between iojs and PostGIS.
- *LeafletJS* in the client-side to manage map interaction.

# Workspace Setup (Ubuntu 14.04)
## Packages Installation
```
# Postgres
sudo apt-get install postgresql postgresql-contrib postgresql-client pgadmin3
sudo apt-get install postgis postgresql-9.3-postgis-scripts
# NodeJS
sudo apt-get install nodejs npm

# Change postgres auth method
sudo sed -i 's&local   all             all                                     peer&local   all             all                                     md5&g' /etc/postgresql/9.3/main/pg_hba.conf
sudo service postgresql restart
```
## PostGIS setup
```
# Create geotabula user
sudo -i -u postgres
createuser -P -s -e lapsocarte
psql -h localhost -U lapsocarte lapsocarte
# Create LapsoCarte database and enable Postgis
createdb -O lapsocarte lapsocarte
psql -c "CREATE EXTENSION postgis; CREATE EXTENSION postgis_topology;" lapsocarte
```