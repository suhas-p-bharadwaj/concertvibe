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
	
	//const 	  API_KEY  			= '7aab177c9f6b959267d27eaff7a1ff40eb1a3f55';
	
	const 	  API_KEY  			= '8da86f0a977a22e600739f6f693b39fddefbd503';
	
	protected $total_score = 0;
	
	protected $types = array('positive'=>0,'negative'=>0,'neutral'=>0);
	
	public function StartTextSentiment($band,$city='',$lat='',$lng=''){
		$result=array();
		$text_blog = '';
		$response=$this->GetTextFromTwitter($band,$city,$lat,$lng);
		
		if(!empty($response->statuses)){
			foreach($response->statuses as $status){
			
				$sentiment=$this->TextSentiment($status->text);
				
				if($sentiment->status=='OK'){
					$result[]=array('screen_name'=>$status->user->screen_name,'created_at'=>$status->created_at,'text'=>self::TwitterizeText($status->text),'score'=>!empty($sentiment->docSentiment->score)?$sentiment->docSentiment->score:'','type'=>$sentiment->docSentiment->type);
					if(!empty($sentiment->docSentiment->score))
						$this->total_score+=$sentiment->docSentiment->score;
					$this->types[$sentiment->docSentiment->type]++;
				}
				
			}
		}
		return array('total_score'=>$this->total_score,'types'=>$this->types,'results'=>$result);
	}
		
	private function TextSentiment($text){
	
		require_once 'Zend/Oauth/Consumer.php';
		$content='';		
		$httpClient = new Zend_Http_Client();
		$httpClient->setMethod(Zend_Http_Client::GET);
		$httpClient->setUri(self::SCOPE.'/TextGetTextSentiment');
		$httpClient->setParameterGet('apikey',self::API_KEY);
		$httpClient->setParameterGet('text',$text);
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
	
	private function GetTextFromTwitter($band,$city='',$lat='',$lng=''){
		$twitter=new Twitter();
		$twitter->setAccessToken();		
		$response=array();
		$response=$twitter->Search($band.'+'.$city,$lat,$lng);
		if(empty($response->statuses)){
			$response=$this->GetTextFromTwitter($band);
		}
		return $response;
	}
	
	public static function TwitterizeText($text)
	{
		if(empty($text))
			return '';
		//$text = self::ConvertLinks($text);			 
		$text = preg_replace('#@([\\d\\w]+)#', '<a href="http://twitter.com/$1" target="_blank">$0</a>', $text);
		$text = preg_replace('/^([\\d\\w]+):/', '<a href="http://twitter.com/$1" target="_blank">$0</a>', $text);
		$text = preg_replace('/#([\\d\\w]+)/', '<a href="http://twitter.com/#search?q=%23$1" target="_blank">$0</a>', $text);
		return $text;
	}
	
	public static function ConvertLinks($text)
	{
		if(empty($text))
			return '';
		if(strstr($text,"http://"))
			$text = preg_replace("[[:alpha:]]+://[^<>[:space:]]+[[:alnum:]/]", "<a href=\"\\0\" target='_blank'>\\0</a>", $text);
		return $text;
	}
	
}
?>