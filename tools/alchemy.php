<?php

include '../lib/load.php';

	$response=array();
	$alc = new AlchemyAPI;
	
	if(isset($_GET['name']))
		$response = $alc->StartTextSentiment($_GET['name'],isset($_GET['lat'])?$_GET['lat']:'',isset($_GET['lng'])?$_GET['lng']:'');
	
	//output results	
	header("Content-type: application/json");
	if(isset($_GET['callback']))
		echo $_GET['callback'] . ' (' . json_encode($response) . ');';	
	else
		echo json_encode($response);

?>