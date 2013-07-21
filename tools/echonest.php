<?php

include '../lib/load.php';

$response=array();
	
	if(!empty($_GET['location']))
		$response = EchoNest::Search($_GET['location']);
	
	//output results	
	header("Content-type: application/json");
	if(isset($_GET['callback']))
		echo $_GET['callback'] . ' (' . json_encode($response) . ');';	
	else
		echo json_encode($response);

?>