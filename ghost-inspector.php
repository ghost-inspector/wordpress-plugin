<?php
/**
 * Plugin Name: Ghost Inspector
 * Plugin URI: http://wordpress.org/extend/plugins/#
 * Description: Display the latest test results of a single suite within your WP Admin Dashboard
 * Author: Ghost Inspector
 * Version: 1.0
 * Author URI: https://ghostinspector.com/
 */

function gi_load_scripts ($hook) {
  // only load scripts on dashboard and settings page
  global $gi_settings_page;
  if ($hook != 'index.php' && $hook != $gi_settings_page) {
    return;
  }

  if (!in_array($_SERVER['REMOTE_ADDR'], array('10.255.0.2', '::1'))) {
    $JSfiles = scandir(dirname(__FILE__) . '/frontend/build/static/js/');
    $react_js_to_load = '';
    foreach($JSfiles as $filename) {
      if(strpos($filename,'.js')&&!strpos($filename,'.js.map')) {
        $react_js_to_load = plugin_dir_url( __FILE__ ) . 'frontend/build/static/js/' . $filename;
      }
    }
  } else {
    // DEV React dynamic loading
    $react_js_to_load = 'http://localhost:3000/static/js/bundle.js';
  }
  wp_enqueue_script('ghost_inspector_react', $react_js_to_load, '', mt_rand(10,1000), true);
  $gi_suite_id = '5be210847a05a37dcf89fc43'; // TODO: get from WP plugin settings
  $gi_title_nonce = wp_create_nonce('gi_api_proxy');
  wp_localize_script('ghost_inspector_react', 'gi_ajax', array(
    'ajax_url' => admin_url('admin-ajax.php'),
    'nonce'    => $gi_title_nonce,
    'suiteId'  => $gi_suite_id,
  ));
}

function gi_api_proxy() {
    // Handle the ajax request
    check_ajax_referer('gi_api_proxy');
    $gi_params = $_GET;
    $gi_params['apiKey'] = '767f9ef8707eef19d823b0f05c2a66e1b0949f0d'; // TODO: get from WP plugin settings
    $gi_api_url = $gi_params['url'];
    // remove WP specific query params before sending request to GI API
    unset($gi_params['_ajax_nonce']);
    unset($gi_params['action']);
    unset($gi_params['url']);
    $response = wp_remote_get(esc_url_raw($gi_api_url) . '?' . http_build_query($gi_params));
    wp_send_json(json_decode(wp_remote_retrieve_body($response), true));
    wp_die(); // All ajax handlers die when finished
}

function gi_add_widget() {
  wp_add_dashboard_widget('ghost_inspector_widget', 'Ghost Inspector', 'gi_display_widget');
}

function gi_display_widget() {
  ?>
  <div id="ghost_inspector_dashboard"></div>
  <?php
}

add_action('admin_enqueue_scripts', 'gi_load_scripts');
add_action('wp_ajax_gi_api_proxy', 'gi_api_proxy' );
add_action('wp_dashboard_setup', 'gi_add_widget');

// SETTINGS

// Init plugin options to white list our options
function ghost_inspector_settings_init(){
	register_setting( 'ghost_inspector_settings_options', 'gi_sample', 'ghost_inspector_settings_validate' );
}

// Add menu page
function ghost_inspector_settings_add_page() {
  global $gi_settings_page;
  $gi_settings_page = add_options_page('Ghost Inspector Settings', 'Ghost Inspector Settings', 'manage_options', 'ghost_inspector_settings', 'ghost_inspector_settings_do_page');
}

// Draw the menu page itself
function ghost_inspector_settings_do_page() {
	?>
	<div id="ghost_inspector_settings"></div>
	<?php
}

// Sanitize and validate input. Accepts an array, return a sanitized array.
function ghost_inspector_settings_validate($input) {
	// Our first value is either 0 or 1
	$input['option1'] = ( $input['option1'] == 1 ? 1 : 0 );
	// Say our second option must be safe text with no HTML tags
	$input['sometext'] =  wp_filter_nohtml_kses($input['sometext']);
	return $input;
}

add_action('admin_init', 'ghost_inspector_settings_init' );
add_action('admin_menu', 'ghost_inspector_settings_add_page');