echo '=================================='
echo 'Executing Setup...'
echo '=================================='

tar -xzf ./firefox-59.tar.gz
chmod +x ./firefox/firefox
mv ./firefox ..
mkdir ../web_driver
chmod +x ./geckodriver
cp ./geckodriver ../web_driver
