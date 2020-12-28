read -n 1 -s -r -p "This file is intended to set up a server to host the Mahjong 4 Friends website. It may overwrite stuff without asking. Press any key to continue"

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

#Symlink to /var/www/html
sudo mv /var/www/html /var/www/oldhtml #Move /var/www/html instead of deleting it... We don't want to delete anything important.
sudo ln -s $HOME/mahjong /var/www/html

echo "You may need to make sure that .htaccess files are enabled."
echo "Edit the AllowOverride statement in the /var/www/ directory selector in the file /etc/apache2/apache2.conf to say All."

read -n 1 -s -r -p "Press any key to continue"

#Enable needed modules
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod http2
sudo a2enmod proxy_wstunnel


sudo tee -a /etc/apache2/conf-available/NODEMAHJONG4FRIENDS.conf > /dev/null << EOF
#Enable reverse proxy to /node.
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
LoadModule proxy_wstunnel_module modules/mod_proxy_wstunnel.so
ProxyPass /node ws://127.0.0.1:3000/node
ProxyRequests off #Not Needed - Good Practice

#Allow HTTP 2.
LoadModule http2_module modules/mod_http2.so
Protocols h2 http/1.1

#Compress JSON
AddOutputFilterByType DEFLATE application/json
EOF

sudo a2enconf NODEMAHJONG4FRIENDS #To disable, run sudo a2disconf NODEMAHJONG4FRIENDS

#Restart apache so configuration changes take effect.
sudo systemctl restart apache2

#Install Certbot
sudo apt-get install -y certbot python-certbot-apache
sudo certbot --apache

echo "Run crontab -e (may need sudo). Add the following lines:"
echo "@reboot node $HOME/mahjong/server.js >> $HOME/mahjong/server/data/server.log"
echo "0 4   *   *   *    sudo reboot"
echo "@reboot sudo certbot renew  >> $HOME/mahjong/server/data/updateCertificate.log"

echo "\nExplanation: Run server on reboot. Reboot at 4am every day. Check certificate every reboot and renew if needed."
echo "You can reboot now or start server.js"
