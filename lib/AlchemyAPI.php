<?php
/** AlchemyAPI
 *
 * @package	concertvibe
 * @author  Andrew Van Tassel <andrew@andrewvantassel.com>
 * @version	0.1
	 http://access.alchemyapi.com/calls/text/TextGetTargetedSentiment
 */

class AlchemyAPI
{ 
	//http://api.setlist.fm/rest/0.1/search/artists.json?artistName=phish
	
	const 	  SCOPE				= 'http://access.alchemyapi.com/calls/text';
	
	const 	  API_KEY  			= '7aab177c9f6b959267d27eaff7a1ff40eb1a3f55';
		
	public static function TextSentiment($band,$lat,$lng){
	
		self::GetTextFromTwitter($band,$lat,$lng);		
		die();
		
		require_once 'Zend/Oauth/Consumer.php';
		$content='';		
		$httpClient = new Zend_Http_Client();
		$httpClient->setMethod(Zend_Http_Client::GET);
		$httpClient->setUri(self::SCOPE.'/TextGetTextSentiment');
		$httpClient->setParameterGet('apikey',self::API_KEY);
		$httpClient->setParameterGet('url','https://twitter.com/search/'.$band);
		$httpClient->setParameterGet('outputMode','json');
				
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
	
	public static function GetTextFromTwitter($band,$lat,$lng){
		$settings = array(
			'oauth_access_token' => "14976359-vVKYKRv1yd4ytR6pLYF3ZMaGeQFJ9GXCn7e1wM18",
			'oauth_access_token_secret' => "WjfINcp4h2MptgUwmTfzpRACvftL34R17c22Dndmhw",
			'consumer_key' => "JNc8HDHgLXY49T5MMyRw",
			'consumer_secret' => "jU2o4WtAnTopJLlttxOm4O06i74XKtOfcVhT1c"
		);
		$twitter = new TwitterAPIExchange($settings);
		$getfield='?q='.$band.'&geocode='.$lat.','.$lng.'&until='.date('Y-m-d',strtotime('-12 days'));
		$response = $twitter->buildOauth('https://api.twitter.com/1.1/search/tweets.json', 'GET')->setGetfield($getfield)->performRequest();
        echo $response;
        
        //return $response;
	}
	
}
?>