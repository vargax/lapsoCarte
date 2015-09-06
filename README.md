LapsoCarte is a web-based visual tool to interact with time-space referenced data. It is based on:

- *PostGIS* as a database engine.
- *NodeJS 0.12* as a server-side platform.

LapsoCarte also uses:

- *GeoTabulaDB* between iojs and PostGIS.
- *LeafletJS* in the client-side to manage map interaction.

LapsoCarte is written in *ECMAScript 6* in boot client and server side. LapsoCarte uses Babel for backward compatibility.

# Workspace Setup (Ubuntu 14.04)
## Packages Installation
```
# Postgres
sudo apt-get install postgresql postgresql-contrib postgresql-client pgadmin3
sudo apt-get install postgis postgresql-9.3-postgis-scripts

# Change postgres auth method
sudo sed -i 's&local   all             all                                     peer&local   all             all                                     md5&g' /etc/postgresql/9.3/main/pg_hba.conf
sudo service postgresql restart
```
For details on how to install NodeJS 0.12 please refer to [NODESOURCE](https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories)

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
## Project setup and NPM dependencies
```
cd pathToProjectRoot
git clone https://github.com/vargax/lapsoCarte.git
cd lapsoCarte
npm install geotabuladb express socket.io babel
```