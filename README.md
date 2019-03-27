## Development

If you want to run this locally, I've included a Docker stack config for Wordpress + MySQL completely configured. Start it with:
```
docker stack deploy -c stack.yml wordpress
```
It will help speed up development to either mount the Docker Wordpress container so you can directly modify the files, or use this command/path to copy the files after saving (adjust for your local):
```
docker cp [local-repo-location]/ghost-inspector.php [your-wordpress-container-id]:/var/www/html/wp-content/plugins/ghost-inspector/ghost-inspector.php
```

Then get the frontend dependencies and start the app (bootstrapped with [Create React App](https://github.com/facebook/create-react-app)):
```
cd frontend
npm install
npm start
```

Note: In the plugin code (PHP) it will look for `$_SERVER['REMOTE_ADDR']` equal to '10.255.0.2' or '::1'. You may need to modify that to use your Docker (or M/W/LAMP setup) IP address. It also expects the React server to be on port 3000.

Note: Both the development and production build expect a single `.js` and a single `.css` file. Create React App has code splitting enabled by default, so there are two scripts which override the Webpack config.

## Deployment

Versioning **TBD** 

Run:
```
npm run export
```

Upload to Wordpress plugins **TBD**
