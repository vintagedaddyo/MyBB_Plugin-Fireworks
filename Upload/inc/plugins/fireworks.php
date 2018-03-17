<?php
/*
 * MyBB: Fireworks
 *
 * File: fireworks.php
 * 
 * Authors: Flobo x3 & Vintagedaddyo
 *
 * MyBB Version: 1.8
 *
 * Plugin Version: 1.2
 * 
 * Based on the script from: https://www.go4u.de/fireworks.htm
 *
 */

// Disallow direct access to this file for security reasons

if(!defined("IN_MYBB"))
{
    die("Direct initialization of this file is not allowed.<br /><br />Please make sure IN_MYBB is defined.");
}

$plugins->add_hook("usercp_options_end", "fireworks_usercp");
$plugins->add_hook("usercp_do_options_end", "fireworks_usercp");
$plugins->add_hook('pre_output_page','fireworks');

function fireworks_info()
{
   global $lang;

    $lang->load("fireworks");
    
    $lang->fireworks_Desc = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" style="float:right;">' .
        '<input type="hidden" name="cmd" value="_s-xclick">' . 
        '<input type="hidden" name="hosted_button_id" value="AZE6ZNZPBPVUL">' .
        '<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">' .
        '<img alt="" border="0" src="https://www.paypalobjects.com/pl_PL/i/scr/pixel.gif" width="1" height="1">' .
        '</form>' . $lang->fireworks_Desc;

    return Array(
        'name' => $lang->fireworks_Name,
        'description' => $lang->fireworks_Desc,
        'website' => $lang->fireworks_Web,
        'author' => $lang->fireworks_Auth,
        'authorsite' => $lang->fireworks_AuthSite,
        'version' => $lang->fireworks_Ver,
        'compatibility' => $lang->fireworks_Compat
    );
}

function fireworks_install() {
    global $db;
    
    // Add field for user option
    
    $db->query("ALTER TABLE ".TABLE_PREFIX."users ADD showFireworks int NOT NULL default '1'");
}

function fireworks_is_installed()
{
    global $db;
    
    if($db->field_exists("showFireworks", "users"))
    {
        return true;
    }
    else 
    {
        return false;
    }
}

function fireworks_uninstall()
{
    global $db;
    
    if($db->field_exists("showFireworks", "users"))
        $db->query("ALTER TABLE ".TABLE_PREFIX."users DROP COLUMN showFireworks");
}

function fireworks_usercp() {
    global $db, $mybb, $templates, $user, $lang;
    $lang->load('fireworks');
    
    if($mybb->request_method == "post")
    {
        $update_array = array(
            "showFireworks" => intval($mybb->input['showFireworks'])
        );      
        $db->update_query("users", $update_array, "uid = '".$user['uid']."'");
    }
    
    $add_option = '</tr><tr>
<td valign="top" width="1"><input type="checkbox" class="checkbox" name="showFireworks" id="showFireworks" value="1" {$GLOBALS[\'$showFireworksChecked\']} /></td>
<td><span class="smalltext"><label for="showFireworks">{$lang->fireworks_show_question}</label></span></td>';

    $find = '{$lang->show_codebuttons}</label></span></td>';
    $templates->cache['usercp_options'] = str_replace($find, $find.$add_option, $templates->cache['usercp_options']);
    
    $GLOBALS['$showFireworksChecked'] = '';
    if($user['showFireworks'])
        $GLOBALS['$showFireworksChecked'] = "checked=\"checked\"";
}

function fireworks($page)
{
    global $mybb;
    
    if($mybb->user['showFireworks']) {
        $page=str_replace('</head>','<script type="text/javascript" src="'.$mybb->settings['bburl'].'/inc/plugins/fireworks/fireworks.js"></script></head>',$page);
    }
    
    return $page;
}

?>