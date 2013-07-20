<?php

include '../lib/load.php';

$response=array();
	
	if(!empty($_GET['artist']))
		$response = SetListFM::Artist($_GET['name']);
	else if(!empty($_GET['events']))
		$response = SetListFM::Setlists($_GET['name']);
	
	//output results	
	header("Content-type: application/json");
	if(isset($_GET['callback']))
		echo $_GET['callback'] . ' (' . json_encode($response) . ');';	
	else
		echo json_encode($response);

?>