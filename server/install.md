# Install Guide

## Initial Setup
- use digital ocean and create an ubuntu 14.04 machine with node v0.12.2 installed
- make sure your root user has a strong password or use ssh
- create a user (I used 'vt') with a strong password that will be running the application
``` bash
adduser vt
# type in password
```
- add the new user to the 'sudo' group (this is temporary and we will revert right before running in production)
``` bash
sudo usermod -a -G sudo vt
```

## Postgres
``` bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres psql postgres
# literally type '\password postgres' in the postgres cli
# then type in a strong password
sudo -u postgres createdb verified_timesheets # or whatever you have in your config/connection.js for a db name
```
I found this information here: https://help.ubuntu.com/community/PostgreSQL. There may be more you need, but I think Waterline ORM will do the rest for us.

## Git
``` bash
sudo apt-get install git
```

## Misc Installs
``` bash
sudo apt-get install python-software-properties python build-essential g++
```

## Sails.js
``` bash
npm -g install sails
```

## Security
Follow this guide to lock down ports and get emails on suspicious behavior: http://www.mysticgear.com/guide/digital-ocean/ubuntu/vps/server-setup/security/mail/postfix/iptables/tripwire/2014/05/04/do-server-setup.html

## Verified Timesheets
### General
``` bash
# get it
cd ~
git clone https://github.com/ingshtrom/verified-timesheets.git
# update the config/connection.js with our postgres info
cd verified-timesheets/server/config
nano connection.js
# update your postgres config with the information from our postgres setup
cd ~/verified-timesheets/server/node_modules/sails/node_modules/express/node_modules/connect
npm install
```

Run `npm install` in the server directory. This should work since we have g++ and build-essentials already installed.


### SSL
See http://chrisrogers.me.uk/blog/sails-js-https-ssl/ and follow the directions there.