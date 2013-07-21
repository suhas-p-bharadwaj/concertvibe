<?php 
 
/** Twitter API
 *
 * @package peeply
 * @author  Andrew Van Tassel <andrew@socialbios.com>
 * @version 2.0
 * @link http://dev.twitter.com/doc
 * @link http://dev.twitter.com/apps/179470
 */
 
 
class Twitter
{
    protected $consumerKey      = 'JNc8HDHgLXY49T5MMyRw';
     
    protected $consumerSecret   = 'jU2o4WtAnTopJLlttxOm4O06i74XKtOfcVhT1c';
    
    protected $oauth_token      = '14976359-vVKYKRv1yd4ytR6pLYF3ZMaGeQFJ9GXCn7e1wM18';
     
    protected $oauth_token_secret   = 'WjfINcp4h2MptgUwmTfzpRACvftL34R17c22Dndmhw';
     
    protected $callback		= 'http://www.concertvibe.com/';
     
    //access token object
    protected $accessToken;
     
    //token stored in DB
    protected $token;
     
    const     SCOPE             = 'https://api.twitter.com/1.1/';
     
    public function __construct($config=null) {
        if(isset($config['callback']))
            $this->setCallback($config['callback']);     
    }
     
    public function setCallback($callback) {
        $this->callback = $callback;
        return $this;
    }
   
    public function getContactCount(){
        return $this->totalContacts;
    }
     
    public function getEmail(){
        return $this->email;
    }
     
    public function getUserId(){
        if(!empty($this->user_id))
            return $this->user_id;
        else if(!empty($this->token))
        {   
            parse_str(self::getToken());
            return $user_id;
        }
        return '';
    }
     
    public function getUsername(){
        if(!empty($this->username))
            return $this->username;
        else if(!empty($this->token))
        {   
            parse_str(self::getToken());
            return $screen_name;
        }
        return '';          
    }
     
    public function getApiKey(){
        return $this->consumerKey;
    }
     
    public function getToken(){
        return $this->token;         
    }
      
    public function getOptions(){
         
    return array(
          'requestScheme' => Zend_Oauth::REQUEST_SCHEME_HEADER,
          'version' => '1.0',
          'consumerKey' => $this->consumerKey,
          'consumerSecret' => $this->consumerSecret,
          'signatureMethod' => 'HMAC-SHA1', 
          'callbackUrl' => $this->callback,
          'requestTokenUrl' => 'https://api.twitter.com/oauth/request_token',
          'userAuthorizationUrl' => 'https://api.twitter.com/oauth/authorize',
          'accessTokenUrl' => 'https://api.twitter.com/oauth/access_token'
        );
     
    }
     
    public function getConsumer(){
         
        return new Zend_Oauth_Consumer(self::getOptions());
    }
     
    public function requestToken(){
     
        require_once 'Zend/Oauth/Consumer.php';
         
        $consumer = self::getConsumer();
                 
        if (empty($this->token)) {
          $_SESSION['REQUEST_TOKEN'] = serialize($consumer->getRequestToken(array('scope' => self::SCOPE)));
          unset($_SESSION['ACCESS_TOKEN']);
        }
         
        return $consumer->getRedirectUrl();
    }
     
    public function setAccessToken()
    {
        require_once 'Zend/Oauth/Consumer.php';
        if(empty($token) && isset($_GET['access_token']))
            $token = $_GET['access_token'];
        else if(empty($token) && !isset($_SESSION['REQUEST_TOKEN']) && isset($_SESSION['ACCESS_TOKEN']))
            $token = $_SESSION['ACCESS_TOKEN'];
        try{
             
                    $accessToken = new Zend_Oauth_Token_Access();
                    $accessToken->setToken($this->oauth_token);
                    $accessToken->setTokenSecret($this->oauth_token_secret);   
                    $this->accessToken=$accessToken;
                    return true;
                       
               
        }
        catch(Exception $e){
            
        }
    }
     
    public function Search($band,$lat=null,$lng=null,$date=true)
    {
        require_once 'Zend/Oauth/Consumer.php';
         
            $content='';
            $httpClient = $this->accessToken->getHttpClient(self::getOptions());
            $httpClient->setUri(self::SCOPE.'search/tweets.json');
            $httpClient->setParameterGet('q',$band);
            /*
if(!empty($lat) && !empty($lng))
	            $httpClient->setParameterGet('geocode',$lat.','.$lng);
*/
	        /*
if($date)
	            $httpClient->setParameterGet('until',date('Y-m-d',strtotime('-12 days')));
*/

            $httpClient->setMethod(Zend_Http_Client::GET);
             
        try{
            //get the raw data
            $response = $httpClient->request();
            //get the body
            $content =  $response->getBody();
        }
        catch(Zend_Http_Client_Adapter_Exception $ex)
        {
             
        }
        /*
if(empty($content) && $date==true)
        	$this->Search($band,$lat,$lng,false);
*/
         
        if(!empty($content))
            return json_decode($content);
        else
            return '';  
    }   
    
}
?>