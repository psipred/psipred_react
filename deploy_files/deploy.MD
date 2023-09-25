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
sudo PUBLIC_URL=http://bioinf.cs.ucl.ac.uk/psipred_beta npm run build
```

4. Enable site

`sudo cp ./deploy_files/httpd.conf /etc/httpd/conf/httpd.conf`

4. Maybe all httpd via selinux

`sudo setsebool -P httpd_can_network_connect on`

5. start/restart apache

`sudo systemctl enable httpd`
`sudo systemctl restart httpd`

# OTHER TEMP DEPLOY NOTES

updating on staging:

aa
commandRunner

hspred and cleanexpect udpate

//blast_cache

psipred_react
