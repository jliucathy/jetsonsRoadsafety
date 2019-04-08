<?php
Class DBRetrieval {
	public $dbh;

	public function __construct() {
		$username = '';
		$password = '';
		$database = '';
		$hostname = '';

        try {
            $this->dbh = new PDO("mysql:host=$hostname;dbname=$database", $username, $password);
            $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e){
            echo $e->getMessage();
        }
    }

    public function __destruct(){
        $this->dbh=null;
    }

    public function selectPark($lng1,$lat1,$lng2,$lat2){
        try{
            $stmt =$this->dbh->prepare("SELECT LONGITUDE, LATITUDE FROM park where LONGITUDE>='$lng1' and LATITUDE >='$lat1' and LONGITUDE <='$lng2' and LATITUDE <='$lat2'");
            $stmt->execute();
            $response = $stmt->fetchAll( PDO::FETCH_ASSOC);
            $result = json_encode($response);
        } catch(PDOException $e){
            echo $e->getMessage();
        }
        return $result;
    }

    public function selectWeekday($lng1,$lat1,$lng2,$lat2) {
        $month=date('n');
        $days = [
            1 => 'Sunday',
            2 => 'Monday',
            3 => 'Tuesday',
            4 => 'Wednesday',
            5 => 'Thursday',
            6 => 'Friday',
            7 => 'Saturday'
        ];
        $weekday=$days[date('N')];
        try {
            $stmt = $dbh->prepare("SELECT LONGITUDE, LATITUDE FROM crash1217 where LONGITUDE>='$lng1' and LATITUDE >='$lat1' and LONGITUDE <='$lng2' and LATITUDE <='$lat2' and MONTH='$month' and DAY_OF_WEEK='$weekday'");
            $stmt->execute();
            $response = $stmt->fetchAll( PDO::FETCH_ASSOC );
            $result = json_encode($response);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return $result;
    }
}
?>
