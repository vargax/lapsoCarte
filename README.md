# LapsoCarte

LapsoCarte is a web-based visual tool to interact with time-space referenced data.

The backend is based on:
- **PostGIS** as a database engine.
- **NodeJS 0.12** as a server-side platform.
- [GeoTabulaDB](https://github.com/tabulaco/geotabuladb) between NodeJS and PostGIS.

The frontend is a fork of [BootLeaf](https://github.com/bmcbride/bootleaf) + [LeafletPlayback](https://github.com/hallahan/LeafletPlayback/) and requires:
- **jQuery**
- **Bootstrap**
- **LeafletJS**
- Typeahead
- Handlebars
- ListJS

Most of LapsoCarte code is written in **ECMAScript 6** and uses **Babel** for backward compatibility.

## Code Patterns
- [EAFP](https://docs.python.org/2/glossary.html#term-eafp): Easier to ask for forgiveness than permission.
- [Mediator Pattern](http://addyosmani.com/largescalejavascript/): Each submodule has its own mediator, who manages all interaction between all its decedent modules and its own main module. Each mediator **must initialize all his decedent modules and save a reference to them**, otherwise the submodule will be destroyed along with its state.
 - The client-side main mediator is [app.js](app/app.js).
 - The server-side main mediator is [index.js](server/index.js).

## Workspace Setup (Ubuntu 14.04)
### Packages Installation
```bash
# Postgres
sudo apt-get install postgresql postgresql-contrib postgresql-client pgadmin3
sudo apt-get install postgis postgresql-9.3-postgis-scripts

# Change postgres auth method
sudo sed -i 's&local   all             all                                     peer&local   all             all                                     md5&g' /etc/postgresql/9.3/main/pg_hba.conf
sudo service postgresql restart
```
For details on how to install NodeJS 0.12 please refer to [NODESOURCE](https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories).

### PostGIS setup
```bash
# Create geotabula user
sudo -i -u postgres
createuser -P -s -e lapsocarte
psql -h localhost -U lapsocarte lapsocarte
# Create LapsoCarte database and enable Postgis
createdb -O lapsocarte lapsocarte
psql -c "CREATE EXTENSION postgis; CREATE EXTENSION postgis_topology;" lapsocarte
```
### Project setup and NPM dependencies
```bash
cd pathToProjectRoot
git clone https://github.com/vargax/lapsoCarte.git
cd lapsoCarte

# Install npm modules
npm install -g napa babel browserify
npm install

# Publish node_modules folder
cd app/public/
mkdir node_modules
cd node_modules
ln -s ../../../node_modules/font-awesome .
ln -s ../../../node_modules/jquery-ui .
```
## App Execution
### Sample data database load
```bash
cd drivers
chmod +x shp+csv.sh
./shp+csv.sh
```
### Project build and execution
```bash
# Compile client-side libraries
npm run build
# Server run
nodejs bootstrap.js
```