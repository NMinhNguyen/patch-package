# make sure errors stop the script
set -e

echo "add patch-package"
yarn add $1

npx replace postinstall lol node_modules/naughty-package/postinstall.sh

echo "SNAPSHOT: the patch creation output should look normal"
(>&2 echo "SNAPSHOT: there should be no stderr")
npx patch-package naughty-package
echo "END SNAPSHOT"
(>&2 echo "END SNAPSHOT")

echo "SNAPSHOT: a patch file got produced"
cat patches/naughty-package+1.0.0.patch
echo "END SNAPSHOT"