FILES=$(trufflehog --max_depth 10 --regex --entropy=True https://github.com/flexion/ef-cms.git | grep 'Filepath:' | grep -v 'package-lock.json')
WC=$(echo "${FILES}" | wc -l)
if [ $WC -ne '1' ]; then echo 'WARNING! A secret key was found in the git repo!'; exit 1; fi