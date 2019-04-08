<?php
    require_once('DBRetrieval.php'); 
    if(isset($_GET['lng1'],$_GET['lat1'],$_GET['lng2'],$_GET['lat2'])){   
        $lng1=$_GET['lng1'];
        $lat1=$_GET['lat1'];
        $lng2=$_GET['lng2'];
        $lat2=$_GET['lat2'];
        $db = new DBRetrieval();
        $data = $db -> selectPark($lng1,$lat1,$lng2,$lat2);
        echo $data;
    }
    else{
        $data='';
        echo "No data";
    }
?>