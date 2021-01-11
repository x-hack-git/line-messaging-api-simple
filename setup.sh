curl -OL https://cli-assets.heroku.com/heroku-linux-x64.tar.gz
tar zxf heroku-linux-x64.tar.gz && rm -f heroku-linux-x64.tar.gz
sudo mv heroku /usr/local
echo 'PATH=/usr/local/heroku/bin:$PATH' >> $HOME/.bash_profile
source $HOME/.bash_profile > /dev/null