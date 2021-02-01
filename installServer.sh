read -p "This file is intended to set up a server to host the Mahjong 4 Friends website. It may overwrite stuff without asking, although will attempt to avoid destroying existing config. Press enter to continue"

#Get updates
sudo apt-get update
sudo apt-get upgrade

#Install git
sudo apt-get install -y git

#Clone mahjong
cd $HOME
git clone https://github.com/ecc521/mahjong.git

#Install NodeJS
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt-get install -y nodejs

#Build mahjong
cd mahjong
npm install

#Install apache
sudo apt-get install -y apache2

#Enable needed modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod http2
sudo a2enmod proxy_wstunnel

sudo rm /etc/apache2/sites-available/mahjong.conf

sudo tee -a /etc/apache2/sites-available/mahjong.conf > /dev/null << EOF
<VirtualHost *:80>
		ServerAdmin admin@mahjong4friends.com
		ServerName mahjong4friends.com
		ServerAlias www.mahjong4friends.com
		DocumentRoot $HOME/mahjong
		ErrorLog ${APACHE_LOG_DIR}/mahjongerror.log
		CustomLog ${APACHE_LOG_DIR}/mahjongaccess.log combined
</VirtualHost>

LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
ProxyPass /node ws://127.0.0.1:7591/node

LoadModule http2_module modules/mod_http2.so
Protocols h2 http/1.1

AddOutputFilterByType DEFLATE application/json
EOF

sudo a2ensite mahjong


#Restart apache so configuration changes take effect.
sudo systemctl restart apache2

#Install Certbot
sudo apt-get install -y certbot python-certbot-apache
sudo certbot --apache


echo "Adding instructions to crontab. The server is currently scheduled to reboot periodically, which you may want to disable. "

#Run server on reboot. Reboot every monday at 2AM EST (7AM UTC). Run certbot renew on each reboot.
(crontab -l ; echo "@reboot mkdir -p $HOME/mahjong/server/data/ && node $HOME/mahjong/server.js >> $HOME/mahjong/server/data/server.log") | sort - | uniq - | crontab -
(crontab -l ; echo "@reboot sudo certbot renew") | sort - | uniq - | crontab -
(crontab -l ; echo "0 7 * * 1 sudo reboot") | sort - | uniq - | crontab - #TODO: Save server state for resumption.

echo "Rebooting now is recommended, and should start the site up properly. "
