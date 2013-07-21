<?php
/** SetListFM
 *
 * @package	concertvibe
 * @author  Andrew Van Tassel <andrew@andrewvantassel.com>
 * @version	0.1
 */

class SetListFM
{ 
	//http://api.setlist.fm/rest/0.1/search/artists.json?artistName=phish
	
	const 	  SCOPE				= 'http://api.setlist.fm/rest/0.1';
	
	const 	  API_KEY  			= '59bb11b3-7c26-4831-9656-02844f0bdedd';
		
	public static function Artist($name){
		require_once 'Zend/Oauth/Consumer.php';
		$content='';		
		$httpClient = new Zend_Http_Client();
		$httpClient->setMethod(Zend_Http_Client::GET);
		$httpClient->setUri(self::SCOPE.'/search/artists.json');
		$httpClient->setParameterGet('artistName',$name);
		//$httpClient->setParameterGet('api_key',self::API_KEY);
				
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
	
	public static function Setlists($name){
		require_once 'Zend/Oauth/Consumer.php';
		$content='';		
		$httpClient = new Zend_Http_Client();
		$httpClient->setMethod(Zend_Http_Client::GET);
		$httpClient->setUri(self::SCOPE.'/search/setlists.json');
		$httpClient->setParameterGet('artistName',$name);
		//$httpClient->setParameterGet('api_key',self::API_KEY);
				
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