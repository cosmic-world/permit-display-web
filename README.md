git init
git add .
git commit -m "my commit"
git branch -M main
git remote add origin https://github.com/cosmic-world/iocl-jrm.git
git remote add origin https://github.com/<your-github-username>/<repository-name>.git
git push -u origin main

npx prettier --write "src/**/*.{js,jsx,css}" <!-- for local -->
prettier --write "src/**/*.{js,jsx,css}"  <!-- for global -->

# nginx commands

taskkill /f /IM nginx.exe
nginx.exe -t
start nginx
nginx -s reload

# create a new git repository on the command line

git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/cosmic-world/permit-display-web.git
git push -u origin main
