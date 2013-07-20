<?php

include '../lib/load.php';

$response=array();
	
	if(!empty($_GET['artist']))
		$response = JamBaseAPI::Artist($_GET['name']);
	else if(!empty($_GET['events']))
		$response = JamBaseAPI::Events($_GET['artistId']);
	
	//output results	
	header("Content-type: application/json");
	if(isset($_GET['callback']))
		echo $_GET['callback'] . ' (' . json_encode($response) . ');';	
	else
		echo json_encode($response);

?>