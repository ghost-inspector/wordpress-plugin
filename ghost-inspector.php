<?php
/**
 * Plugin Name: Ghost Inspector
 */

if (!in_array($_SERVER['REMOTE_ADDR'], array('10.255.0.2', '::1'))) {
  $JSfiles = scandir(dirname(__FILE__) . '/frontend/build/static/js/');
  $react_js_to_load = '';
   foreach($JSfiles as $filename) {
     if(strpos($filename,'.js')&&!strpos($filename,'.js.map')) {
       $react_js_to_load = plugin_dir_url( __FILE__ ) . 'frontend/build/static/js/' . $filename;
     }
   }
} else {
  $react_js_to_load = 'http://localhost:3000/static/js/bundle.js';
}
// DEV
// React dynamic loading
wp_enqueue_script('ghost_inspector_react', $react_js_to_load, '', mt_rand(10,1000), true);
// wp_enqueue_script('ghost_inspector_chunk_0', $js_chunk0_to_load, '', mt_rand(10,1000), true);
// wp_enqueue_script('ghost_inspector_chunk_main', $js_main_chunk_to_load, '', mt_rand(10,1000), true);

add_action('wp_dashboard_setup', 'gi_add_widget');
  
function gi_add_widget() {
  global $wp_meta_boxes;
  wp_add_dashboard_widget('ghost_inspector_widget', 'Ghost Inspector', 'gi_display_widget');
}
 
function gi_display_widget() {
  include 'ghost-inspector-display.php';
}