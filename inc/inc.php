<?php
/*
 * @Author: Qinver
 * @Url: zibll.com
 * @Date: 2021-05-25 14:35:52
 * @LastEditTime: 2022-12-16 14:28:30
 */

/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 *
 *
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 *            佛祖保佑       永不宕机     永无BUG
 *
 */

/*
 * @Author        : Qinver
 * @Url           : zibll.com
 * @Date          : 2020-11-11 11:35:21
 * @LastEditTime: 2020-12-23 22:31:32
 * @Email         : 770349780@qq.com
 * @Project       : Zibll子比主题
 * @Description   : 一款极其优雅的Wordpress主题
 * @Read me       : 感谢您使用子比主题，主题源码有详细的注释，支持二次开发。
 * @Remind        : 使用盗版主题会存在各种未知风险。支持正版，从我做起！
 */

//添加强制HTTPS判断，兼容站长CDN SSL设置错误时网站也能访问
function zib_content_url_filter($url)
{
    if (!preg_match('/^https/', $url)) {
        $home_url = home_url();
        if (preg_match('/^https/', $home_url)) {
            $url = str_replace('http', 'https', $url);
        }
    }
    return $url;
}
add_filter('content_url', 'zib_content_url_filter');

//定义常量
define('ZIB_TEMPLATE_DIRECTORY_URI', get_template_directory_uri()); //本主题
define('ZIB_ROOT_PATH', dirname(__DIR__) . '/'); //本主题的路径

$theme_data = wp_get_theme();
$_version   = $theme_data['Version'];
define('THEME_VERSION', $_version);

//php版本判断
if (PHP_VERSION_ID < 70000) {
    wp_die('PHP 版本过低，请先升级php版本到7.0及以上版本，当前php版本为：' . PHP_VERSION);
}

//载入文件
$require_once = array(
    'inc/dependent.php',
    'vendor/autoload.php',
    'inc/class/class.php',
    'inc/code/require.php',
    'inc/codestar-framework/codestar-framework.php',
    'inc/widgets/widget-class.php',
    'inc/options/options.php',
    'inc/functions/functions.php',
    'inc/widgets/widget-index.php',
    'oauth/oauth.php',
    'zibpay/functions.php',
    'action/function.php',
    'inc/csf-framework/classes/zib-csf.class.php',
);

foreach ($require_once as $require) {
    require_once get_theme_file_path('/' . $require);
}

//codestar演示
//require_once get_theme_file_path('/inc/codestar-framework/samples/admin-options.php');
