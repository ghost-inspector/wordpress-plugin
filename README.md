## Development

[Read the tutorial](https://ghostinspector.com/blog/develop-wordpress-plugin-with-webpack-and-react/) if you want to learn how this plugin was developed and how to build your own plugin using React and Webpack.

### Quick Start

If you want to run this locally, I've included a Docker stack config for Wordpress + MySQL completely configured. Start it with:
```
docker stack deploy -c stack.yml wordpress
```

It will help speed up development to either mount the Docker Wordpress container so you can directly modify the files, or use this command/path to copy the files after saving (adjust for your local path, container ID):

```
docker cp [local-repo-location]/ghost-inspector.php [your-wordpress-container-id]:/var/www/html/wp-content/plugins/ghost-inspector/ghost-inspector.php
```

Get the frontend dependencies and start the app:
```
cd frontend
npm install
npm start
```

Note: In the plugin code (PHP) it will look for `$_SERVER['REMOTE_ADDR']` equal to '10.255.0.2' or '::1'. You may need to modify that to use your Docker (or M/W/LAMP setup) IP address. It also expects the React server to be on port 3000.

Note: Both the development and production build expect a single `.js` and a single `.css` file. Create React App has code splitting enabled by default, so there are two scripts which override the Webpack config.

## Manually Installing Plugin

To get a `.zip` file for [manual plugin installation](https://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation_by_Uploading_a_Zip_Archive), run:
```shell
npm run export
```

## Usage

You can install manually using the instructions above. Download the latest version from the [WordPress.org plugin directory](https://wordpress.org/plugins/ghost-inspector/). Or you can install from your WordPress admin by searching for the plugin "ghost inspector". In either case, follow [these instructions](https://ghostinspector.com/blog/ghost-inspector-wordpress-plugin/) to install and setup the plugin.