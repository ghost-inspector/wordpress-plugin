## Development

[Read the tutorial](https://ghostinspector.com/blog/develop-wordpress-plugin-with-webpack-and-react/) if you want to learn how this plugin was developed and how to build your own plugin using React and Webpack.

### Quick Start

If you want to run this locally, I've included a docker-compose config for Wordpress + MySQL completely configured. Start it with:
```
docker-compose up
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

Note: The [plugin code](https://github.com/ghost-inspector/wordpress-plugin/blob/stable/ghost-inspector.php) (PHP) looks for `$_SERVER['REMOTE_ADDR']` equal to '10.255.0.2' or '::1' to detect if WordPress is running locally. You may need to modify that to use your Docker (or M/W/LAMP setup) IP address. In local mode, it expects the Ghost Inspector API to be running on localhost:5021 and the React app in this repo to be on localhost:3000.

Note: Both the development and production build expect a single `.js` and a single `.css` file. Create React App has code splitting enabled by default, so there are two scripts which override the Webpack config.

## Manually Installing Plugin

To get a `.zip` file for [manual plugin installation](https://codex.wordpress.org/Managing_Plugins#Manual_Plugin_Installation_by_Uploading_a_Zip_Archive), run (from /frontend):
```shell
npm run export
```

## Testing With Unreleased WordPress

Install the [WordPress Beta Tester](https://wordpress.org/plugins/wordpress-beta-tester/) plugin to update your version of WordPress running in Docker to a nightly or bleeding edge build.

## Usage

You can install manually using the instructions above. Download the latest version from the [WordPress.org plugin directory](https://wordpress.org/plugins/ghost-inspector/). Or you can install from your WordPress admin by searching for the plugin "ghost inspector". In either case, follow [these instructions](https://ghostinspector.com/blog/ghost-inspector-wordpress-plugin/) to install and setup the plugin.

## How to Release

1. Update version in package.json, readme.txt, and ghost-inspector.php
2. Add an entry to changelog in readme.txt
3. Merge to `stable` in git
4. Prepare a release by running `npm run export` from `/frontend`. Unzip the contents into the SVN trunk directory (overwriting the existing files).
5. [Commit the changes to SVN](https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/#editing-existing-files)
  - You will need to install `svn`. On MacOS, this can be done with `brew install svn`
  - The repository is located at https://plugins.svn.wordpress.org/ghost-inspector/
  - The account with permissions is in the Engineering 1Password vault. It's username `ghostinspector` (with email address `tech@ghostinspector.com`)
6. [Tag a new version](https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/#tagging-new-versions)

### Updating Logo

1. Update logo(s) in `assets` folder
2. Copy to SVN - [follow instructions for updating](https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/)