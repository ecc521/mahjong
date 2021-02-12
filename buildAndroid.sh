rm -rf android
mkdir android
npx bubblewrap update --skipVersionUpdate --directory android
cp twa-manifest.json android/twa-manifest.json
pushd android
npx bubblewrap build
popd
#May need to cd into android dir and copy manifest in.
#May also need to switch to absolute keystore path
