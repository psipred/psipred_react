# Apache deploy instructions

1. install dependencies nodejs npm apache2

`sudo dnf install httpd nodejs npm`

2. check out our app

``` bash
cd /var/www
sudo git clone https://github.com/psipred/psipred_react.git
```

3. Maybe build it if the build/ dir is not there

``` bash
cd psipred_react
sudo npm install
sudo npm run build
```

4. Enable site

`sudo a2ensite deploy_files/my-app.conf`

5. start/restart apache

`sudo systemctl restart apache2`