<?php

if (isset($_POST["name"]) && isset($_POST["email"]) && isset($_POST["subject"]) && isset($_POST["message"])) {

    $name = $_POST["name"];
    $email = $_POST["email"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];

    $msg = "
Hai, Growsoon Infotech! New Message

Name : $name
Email : $email
Subject : $subject
Message : $message";

    // Set your Bot ID and Chat ID.
    $telegrambot = '7437847192:AAFm0knUECBG-hALj4jkNoh9TFk7YC_dC8o';
    $telegramchatid = 7977481924;

    function telegram($msg) {
        global $telegrambot, $telegramchatid;
        $url = 'https://api.telegram.org/bot' . $telegrambot . '/sendMessage';
        $data = array('chat_id' => $telegramchatid, 'text' => $msg);
        $options = array(
            'http' => array(
                'method'  => 'POST',
                'header'  => "Content-Type:application/x-www-form-urlencoded\r\n",
                'content' => http_build_query($data),
            ),
        );
        $context = stream_context_create($options);
        $result = file_get_contents($url, false, $context);
        return $result;
    }

    // Send the message
    telegram($msg);

    // ✅ Return OK to frontend
    echo 'OK';

} else {
    // ❌ Missing POST fields, send error response
    http_response_code(400);
    echo 'Missing form fields';
}
