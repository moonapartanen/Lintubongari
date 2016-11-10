<?php
	function GetData($var)
	{
		$data = NULL;
		
		if(isset($_GET[$var]))
		{
			$data = $_GET[$var];
		}
		
		return $data;
	}
	
	function GetPost($var)
	{
		$data = NULL;
		
		if(isset($_POST[$var]))
		{
			$data = $_POST[$var];
		}
		
		return $data;
	}
	
	$json = GetData("json");
	$xml = GetData("xml");
	$html = GetData("html");
	$url = GetPost("urldata");
	$documentID = GetPost("documentID");
	
	if($json)
	{
		echo file_get_contents($url); 
	}
	elseif($xml)
	{
		echo file_get_contents("http://hatikka.fi/?page=view&id=" .$documentID . "&source=2&xsl=false");
	}
	elseif($html)
	{
		echo file_get_contents("http://atlas3.lintuatlas.fi/tulokset/lajit_ryhmittain");
	}
?>