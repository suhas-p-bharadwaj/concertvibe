<?php

include '../lib/load.php';

	$response=array();
	
	if(isset($_GET['name']) && isset($_GET['lat']) && isset($_GET['lng']))
		$response = AlchemyAPI::TextSentiment($_GET['name'],$_GET['lat'],$_GET['lng']);
	
	//output results	
	header("Content-type: application/json");
	if(isset($_GET['callback']))
		echo $_GET['callback'] . ' (' . json_encode($response) . ');';	
	else
		echo json_encode($response);

?>