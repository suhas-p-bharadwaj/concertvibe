<?php
/** EchoNest
 *
 * @package	concertvibe
 * @author  Andrew Van Tassel <andrew@andrewvantassel.com>
 * @version	0.1
	 http://developer.echonest.com/api/v4/artist/profile?api_key=FILDTEOIK2HBORODV&name=weezer
 */

class EchoNest
{ 
	//http://api.setlist.fm/rest/0.1/search/artists.json?artistName=phish
	
	const 	  SCOPE				= 'http://developer.echonest.com/api/v4';
	
	const 	  API_KEY  			= 'MLLXVYVHVNMF4YYDV';
		
	public static function Search($location){
	
		require_once 'Zend/Oauth/Consumer.php';
		$content='';		
		$httpClient = new Zend_Http_Client();
		$httpClient->setMethod(Zend_Http_Client::GET);
		$httpClient->setUri(self::SCOPE.'/artist/search');
		$httpClient->setParameterGet('api_key',self::API_KEY);
		$httpClient->setParameterGet('artist_location',$location);
				
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