<?php
/**
 * Plugin Name: Ghost Inspector
 * Plugin URI: http://wordpress.org/plugins/ghost-inspector
 * Description: Display the latest test results of a single suite on your dashboard. To get started: sign up for an account on <a href="http://ghostinspector.com">ghostinspector.com</a> and add your API key and your suite ID to your Ghost Inspector settings here in Wordpress. Build or record automated website tests in your browser with Ghost Inspector. We run them continuously from the cloud, monitoring your website for issues.
 * Version: 1.0.0
 * Author: Ghost Inspector
 * Author URI: https://ghostinspector.com
 * Text Domain: ghost-inspector
 */

// proxy requests to the GI API so that the API key remains hidden
function gi_api_proxy($request) {
  $gi_params = $request->get_query_params();
  $gi_params['apiKey'] = get_option('gi_api_key');
  $gi_endpoint = $gi_params['endpoint'];
  unset($gi_params['endpoint']);
  $gi_request = wp_remote_get("https://api.ghostinspectortest.com/v1$gi_endpoint" . '?' . http_build_query($gi_params));
  return json_decode(wp_remote_retrieve_body($gi_request));
}

// get saved settings from WP DB
function gi_get_settings($request) {
  $api_key = get_option('gi_api_key');
  $suite_id = get_option('gi_suite_id');
  return new WP_REST_RESPONSE(array(
    'success' => true,
    'value'   => array(
      'apiKey'  => !$api_key ? '' : $api_key,
      'suiteId' => !$suite_id ? '' : $suite_id,
    )
  ), 200);
}

// save settings to WP DB
function gi_update_settings($request) {
  $gi_json = $request->get_json_params();
  // store the values in wp_options table
  $updated_api_key = update_option('gi_api_key', $gi_json['apiKey']);
  $updated_suite_id = update_option('gi_suite_id', $gi_json['suiteId']);
  return new WP_REST_RESPONSE(array(
    'success' => $updated_api_key && $updated_suite_id,
    'value'   => $gi_json
  ), 200);
}

// check permissions
function gi_settings_permissions_check() {
  // Restrict endpoint to only users who have the capability to manage options.
  if (current_user_can('manage_options')) {
    return true;
  }

  return new WP_Error('rest_forbidden', esc_html__('You do not have permissions to view this data.', 'ghost-inspector'), array('status' => 401));;
}

add_action('rest_api_init', function () {
  register_rest_route('ghost-inspector/v1', '/proxy', array(
    // By using this constant we ensure that when the WP_REST_Server changes our readable endpoints will work as intended.
    'methods'  => WP_REST_Server::READABLE,
    // Here we register our callback. The callback is fired when this endpoint is matched by the WP_REST_Server class.
    'callback' => 'gi_api_proxy',
  ));
  register_rest_route('ghost-inspector/v1', '/settings', array(
    'methods'  => WP_REST_Server::READABLE,
    'callback' => 'gi_get_settings',
    'permission_callback' => 'gi_settings_permissions_check'
  ));
  register_rest_route('ghost-inspector/v1', '/settings', array(
    'methods'  => WP_REST_Server::CREATABLE,
    'callback' => 'gi_update_settings',
    'permission_callback' => 'gi_settings_permissions_check'
  ));
});

add_action('admin_enqueue_scripts', function ($hook) {
  // only load scripts on dashboard and settings page
  global $gi_settings_page;
  if ($hook != 'index.php' && $hook != $gi_settings_page) {
    return;
  }

  if (in_array($_SERVER['REMOTE_ADDR'], array('10.255.0.2', '::1'))) {
    // DEV React dynamic loading
    $gi_js_to_load = 'http://localhost:3000/static/js/bundle.js';
  } else {
    $gi_js_to_load = plugin_dir_url( __FILE__ ) . 'ghost-inspector.js';
    $gi_css_to_load = plugin_dir_url( __FILE__ ) . 'ghost-inspector.css';
  }

  wp_enqueue_style('ghost_inspector_styles', $gi_css_to_load);
  wp_enqueue_script('ghost_inspector_react', $gi_js_to_load, '', mt_rand(10,1000), true);
  wp_localize_script('ghost_inspector_react', 'gi_ajax', array(
    'urls'    => array(
      'proxy'    => rest_url('ghost-inspector/v1/proxy'),
      'settings' => rest_url('ghost-inspector/v1/settings')
    ),
    'nonce'   => wp_create_nonce('wp_rest'),
    'suiteId' => get_option('gi_suite_id'),
  ));
});

// display dashboard widget
add_action('wp_dashboard_setup', function () {
  wp_add_dashboard_widget('ghost_inspector_widget', 'Ghost Inspector', 'gi_display_widget');
  function gi_display_widget() {
    ?>
    <div id="ghost_inspector_dashboard"></div>
    <?php
  }
});

// add to settings menu
add_action('admin_menu', function () {
  global $gi_settings_page;
  $gi_settings_page = add_options_page('Ghost Inspector Settings', 'Ghost Inspector', 'manage_options', 'ghost-inspector-settings', 'ghost_inspector_settings_do_page');
  // Draw the menu page itself
  function ghost_inspector_settings_do_page() {
    ?>
    <div id="ghost_inspector_settings"></div>
    <?php
  }

  // add link to settings on plugin page (next to "Deactivate")
  add_filter('plugin_action_links_' . plugin_basename(__FILE__), function ($links) {
    $settings_link = '<a href="options-general.php?page=ghost-inspector-settings">' . __( 'Settings' ) . '</a>';
    array_unshift($links, $settings_link);
    return $links;
  });
});

// cleanup data on uninstall
function ghost_inspector_uninstall () {
  delete_option('gi_api_key');
  delete_option('gi_suite_id');
}

register_uninstall_hook(__FILE__, 'ghost_inspector_uninstall');
