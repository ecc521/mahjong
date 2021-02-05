npx cap add ios && npx cordova-res ios --copy #Generate the ios directory and icons (errors if doesn't exist)

rm -rf capacitorDir #Purge the current capacitorDir directory so that junk can't accumulate.
mkdir capacitorDir
cp -r assets capacitorDir/assets
cp -r index.html capacitorDir/index.html

npx cap copy
npx cap open ios #Open in XCode
