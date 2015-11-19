# LapsoCarte

LapsoCarte is a web-based visual tool to interact with time-space referenced data.

The backend is based on:
- [**PostGIS**](http://postgis.net/) as a database engine.
- [**NodeJS 0.12**](https://nodejs.org/en/) as a server-side platform.
  - [Express](http://expressjs.com/) as a web framework.
  - [Socket.oi](http://socket.io/) to manage socket communications.
- [GeoTabulaDB](https://github.com/tabulaco/geotabuladb) between NodeJS and PostGIS.
- [jStat](https://github.com/jstat/jstat) to calculate descriptive statistics.

The frontend is based on:
- [**LeafletJS**](http://leafletjs.com/) to represent WHEREs (spatial dimension).
- [**noUiSlider**](http://refreshless.com/nouislider/) to represent WHENs (temporal dimension).
- [jQuery](https://jquery.com/) to handle web browser events.
- [Less](http://lesscss.org/) to compile the CSS stylesheets.
- [Handlebars](http://handlebarsjs.com/) to manage HTML templates.

LapsoCarte code is written in **ECMAScript 6** and uses [**Babel**](https://babeljs.io/) for backward compatibility.

## Code Patterns
- [EAFP](https://docs.python.org/2/glossary.html#term-eafp): Easier to ask for forgiveness than permission.
- [Mediator Pattern](http://addyosmani.com/largescalejavascript/): Each submodule has its own mediator, who manages all interaction between all its decedent modules and its own main module. Each mediator **must initialize all his decedent modules and save a reference to them**, otherwise the submodule will be destroyed along with its state.
  - The client-side main mediator is [app.js](app/app.js).
  - The server-side main mediator is [index.js](server/index.js).
- All App and Server shared constants and variables are in [Globals.js](Globals.js)
  - **PROJECT constant**: This JavaScript object is a single point who holds all the project specific parameters such as:
    - Database credentials, tables and columns names.
    - WHERE dimension representation setup.
    - *Leaflet* map configuration.
    - **Instance object**: This is a *run time* object who holds the state of the displayed instance, including the current (HOW, WHAT, WHEN) tuple, the DATA_MAP and the relevant descriptive statistics.

## Architecture
- Red modules are mediators.
- Yellow-border modules access elements in Globals.js.
- Green modules provides task specific classes (reusable code).
- Aqua modules are small embedded modules (code is in it's parent module).
- Yellow objects are the JavaScript objects in Globals.js.

![Architecture](doc/arch.png)

## Workspace Setup (Ubuntu 14.04)
### Packages Installation
```bash
# Postgres
sudo apt-get install postgresql postgresql-contrib postgresql-client pgadmin3
sudo apt-get install postgis postgresql-9.3-postgis-scripts

# Change postgres auth method
sudo sed -i 's&local   all             all                                     peer&local   all             all                                     md5&g' /etc/postgresql/9.3/main/pg_hba.conf
sudo su postgres <<EOF
psql -c "REVOKE CONNECT ON DATABASE template1 FROM PUBLIC;"
EOF
sudo service postgresql restart
```
For details on how to install NodeJS 0.12 please refer to [NODESOURCE](https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories).

### App setup and NPM dependencies
```bash
cd pathToProjectRoot
git clone https://github.com/vargax/lapsoCarte.git
cd lapsoCarte

# Install npm modules
sudo npm install -g napa babel browserify less
npm install

# Publish node_modules folder
cd app/public/
mkdir node_modules
cd node_modules
ln -s ../../../node_modules/font-awesome .
```

### PostGIS setup
```bash
cd drivers
chmod +x create_user.sh
sudo ./create_user.sh lapsocarte
```
The `create_user.sh` script will create a new postgresql user *lapsocarte* with password *lapsocarte* in *localhost*. Then it will create the database *lapsocarte* and enable the PostGIS extension on it.
The idea is to have one PostgreSQL user and database per project.

### Globals
The [Globals.js](Globals.js) define a JavaScript object with all the required parameters for a given project. It is possible to change between projects changing the `export const PROJECT` constant.
  You must recompile and rerun the application to see the changes:
  ```bash
  # Compile client-side libraries
  npm run build
  # Server run
  node bootstrap.js
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
node bootstrap.js
```
### Sample Screenshot
![screenshot](doc/proto.png)
