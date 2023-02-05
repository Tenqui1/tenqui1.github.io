<?php
/*
 * @Author        : Qinver
 * @Url           : zibll.com
 * @Date          : 2022-11-26 14:17:26
 * @LastEditTime: 2022-12-08 21:50:55
 * @Email         : 770349780@qq.com
 * @Project       : Zibll子比主题
 * @Description   : 一款极其优雅的Wordpress主题|附件相关函数
 * @Read me       : 感谢您使用子比主题，主题源码有详细的注释，支持二次开发。
 * @Remind        : 使用盗版主题会存在各种未知风险。支持正版，从我做起！
 */

// 上传文件自动重命名
function zib_new_filename($file)
{
    if (_pz('newfilename')) {
        $info         = pathinfo($file['name']);
        $ext          = empty($info['extension']) ? '' : '.' . $info['extension'];
        $md5          = md5($file['name']);
        $file['name'] = substr($md5, 0, 10) . current_time('His') . $ext;
    }
    return $file;
}
add_filter('wp_handle_upload_prefilter', 'zib_new_filename', 99);

//添加系统允许上传的文件类型
function zib_upload_mimes_filter($mimes)
{

    if (_pz('allow_upload_svg') || (_pz('admin_allow_upload_svg') && is_super_admin())) {
        $mimes['svg'] = 'image/svg+xml';
    }

    return $mimes;
}
add_filter('upload_mimes', 'zib_upload_mimes_filter');

//在文章编辑页面的[添加媒体]只显示用户自己上传的文件
function zib_upload_media($wp_query_obj)
{
    global $current_user, $pagenow;
    if (!is_a($current_user, 'WP_User')) {
        return;
    }

    if ('admin-ajax.php' != $pagenow || 'query-attachments' != $_REQUEST['action']) {
        return;
    }

    if (!current_user_can('manage_options') && !current_user_can('manage_media_library')) {
        $wp_query_obj->set('author', $current_user->ID);
    }

    return;
}
add_action('pre_get_posts', 'zib_upload_media');

//在[媒体库]只显示用户上传的文件
function zib_media_library($wp_query)
{
    if (strpos($_SERVER['REQUEST_URI'], '/wp-admin/upload.php') !== false) {
        if (!current_user_can('manage_options') && !current_user_can('manage_media_library')) {
            global $current_user;
            $wp_query->set('author', $current_user->id);
        }
    }
}
add_filter('parse_query', 'zib_media_library');
