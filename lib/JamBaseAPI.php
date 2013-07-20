<?php
/** JamBaseAPI
 *
 * @package	concertvibe
 * @author  Andrew Van Tassel <andrew@andrewvantassel.com>
 * @version	0.1
 */

class JamBaseAPI
{ 
	const 	  SCOPE				= 'http://api.jambase.com';
	
	const 	  API_KEY  			= 'X6KBNZWRKB5NDG7YUVF4JUJ2';
		
	public static function Artist($name){
		require_once 'Zend/Oauth/Consumer.php';
		$content='';		
		$httpClient = new Zend_Http_Client();
		$httpClient->setMethod(Zend_Http_Client::GET);
		$httpClient->setUri(self::SCOPE.'/artists');
		$httpClient->setParameterGet('name',$name);
		$httpClient->setParameterGet('page',0);
		$httpClient->setParameterGet('api_key',self::API_KEY);
		$httpClient->setParameterGet('o','json');
				
		try{
			//get the raw data
			$response = $httpClient->request();
			//get the body
			$content =  $response->getBody();
		} 
		catch(Zend_Http_Client_Adapter_Exception $ex)
		{
								
		}

		if(!empty($content))
			return json_decode($content);
		else
			return '';
	}
	
	public static function Events($artistId){
		require_once 'Zend/Oauth/Consumer.php';
		$content='';		
		$httpClient = new Zend_Http_Client();
		$httpClient->setMethod(Zend_Http_Client::GET);
		$httpClient->setUri(self::SCOPE.'/events');
		$httpClient->setParameterGet('artistId',$artistId);
		$httpClient->setParameterGet('page',0);
		$httpClient->setParameterGet('startDate','2013-01-01T20:00:00');		
		$httpClient->setParameterGet('api_key',self::API_KEY);
		$httpClient->setParameterGet('o','json');
				
		try{
			//get the raw data
			$response = $httpClient->request();
			//get the body
			$content =  $response->getBody();
		} 
		catch(Zend_Http_Client_Adapter_Exception $ex)
		{
								
		}
		if(!empty($content))
			return json_decode($content);
		else
			return '';
	}
}
?>