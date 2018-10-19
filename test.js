var map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: -37.9172708,
        lng: 145.1251862
    },
    zoom: 8
});
// Adding a LatLng for
var places = [];
var markers = [];
//user input start position
var address;
// user input destination
var destination;
//store data
var dataPiece;
var topData = new Array();
//start position's latitude and longitude
var lat;
var lng;
//start position's zoom latitude and longitude
var latMin;
var latMax;
var lngMin;
var lngMax;
//destination's latitude and longitude
var desLat;
var desLng;
//destination's zoom latitude and longitude
var desLatMin;
var desLatMax;
var desLngMin;
var desLngMax;
//latitude and longitude of area selected to search accident
var finalLatMin;
var finalLatMax;
var finalLngMin;
var finalLngMax;
//array to store accident's name
var tArray = new Array();
//array to store how many times all kind of accident happend.
var nArray = new Array();
// top five accident reason arrray
var findMaxList = new Array();
var findListIndex = -1;
var inputStart = document.getElementById('start');
var inputEnd = document.getElementById('end');
var inputSelect = document.getElementById('select');
var autocompleteStart = new google.maps.places.Autocomplete(inputStart);
var autocompleteEnd = new google.maps.places.Autocomplete(inputEnd);
autocompleteStart.addListener('place_changed', function() {
    address = autocompleteStart.getPlace();
});
autocompleteEnd.addListener('place_changed', function() {
    destination = autocompleteEnd.getPlace();
});

var value = new Array();
var icons = new Array();
icons[0] = "./images/top1.png";
icons[1] = "./images/top2.png";
icons[2] = "./images/top3.png";
icons[3] = "./images/top4.png";
icons[4] = "./images/top5.png";
icons[5] = "./images/top6.png";
icons[6] = "./images/top7.png";
icons[7] = "./images/top8.png";
icons[8] = "./images/top9.png";
icons[9] = "./images/top10.png";

function deleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    console.log("remove");
    console.log(markers);
    console.log(places);
}

function initMap()
//detect user's choice of search a positon or a route
{
    if (address.geometry) {
        lat = address.geometry.location.lat();
        lng = address.geometry.location.lng();
        latMin = lat - 0.005;
        latMax = lat + 0.005;
        lngMin = lng - 0.005;
        lngMax = lng + 0.005;
        console.log(latMin);
        console.log(latMax);
        console.log(lngMin);
        console.log(lngMax);
        //after get start position's data, try destination one
        if (destination.geometry) {
            desLat = destination.geometry.location.lat();
            desLng = destination.geometry.location.lng();
            //zoom a bit to ensure SURROUNDINGS is included
            desLatMin = desLat - 0.005;
            desLatMax = desLat + 0.005;
            desLngMin = desLng - 0.005;
            desLngMax = desLng + 0.005;
            console.log(desLatMin);
            console.log(desLatMax);
            console.log(desLngMin);
            console.log(desLngMax);
            //after get two point's longtitude and lantitude, run myCallback
            myTemp();
        } else {
            alert("Wrong address1!");
        }
    } else {
        alert("Wrong address2!");
    }
}


function myTemp()
//after get two point's longtitude and lantitude, use their zoom longtitude and latitude to select the largest rectangle on the map
{
    finalLatMax = -9999;
    finalLatMin = 9999;
    if (finalLatMax < latMax) {
        finalLatMax = latMax;
    }
    if (finalLatMax < desLatMax) {
        finalLatMax = desLatMax;
    }
    if (finalLatMin > latMin) {
        finalLatMin = latMin;
    }
    if (finalLatMin > desLatMin) {
        finalLatMin = desLatMin;
    }
    finalLngMax = -9999;
    finalLngMin = 9999;
    if (finalLngMax < lngMax) {
        finalLngMax = lngMax;
    }
    if (finalLngMax < desLngMax) {
        finalLngMax = desLngMax;
    }
    if (finalLngMin > lngMin) {
        finalLngMin = lngMin;
    }
    if (finalLngMin > desLngMin) {
        finalLngMin = desLngMin;
    }
    console.log('final');
    console.log(finalLatMin);
    console.log(finalLatMax);
    console.log(finalLngMin);
    console.log(finalLngMax);
    //run search after get the largest rectangle area

    searchAcc();
}

function searchAcc() {
    var choice = document.getElementById('choice').value;
    var con_db;
    var cenlat = (finalLatMin + finalLatMax) / 2;
    var cenlng = (finalLngMin + finalLngMax) / 2;
    map.setCenter({
        lat: cenlat,
        lng: cenlng
    });
    map.setZoom(14);
    console.log("second");
    if (markers.length > 0) {
        deleteMarkers();
    }
    if (choice == "fatal") {
        con_db = "con_db_f.php";
    } else if (choice == "serious") {
        con_db = "con_db_s.php";
    } else if (choice == "other") {
        con_db = "con_db_o.php";
    }

    $.ajax({
        url: con_db,
        type: 'GET',
        async: false,
        data: {
            lng1: finalLngMin,
            lat1: finalLatMin,
            lng2: finalLngMax,
            lat2: finalLatMax
        },
        dataType: "json",
        success: function(data) {
            console.log(data);
            dataPiece = data;
            //array to store accident's name
            tArray = new Array();
            //array to store how many times all kind of accident happend.
            nArray = new Array();
            //group by all accidents by their reasons
            for (var i = 0; i < dataPiece.length; i++) {
                var sign = 0;
                var pos = -1;
                for (j = 0; j < tArray.length; j++) {
                    if (dataPiece[i]['DCA_CODE'] == tArray[j]) {
                        sign = 1;
                        pos = j;
                    }
                }
                if (sign == 0) {
                    tArray[tArray.length] = dataPiece[i]['DCA_CODE'];
                    nArray[nArray.length] = 1;
                }
                if (sign == 1) {
                    nArray[pos] = nArray[pos] + 1;
                }
            }
            console.log(tArray);
            console.log(nArray);
            //find max number of accident for first time and store
            for (var g = 0; g < 10; g++) {
                findMax();
            }
            console.log(nArray);
            console.log(findMaxList);
            for (var i = 0; i < 10; i++) {
                topData[i] = dataPiece.filter(function(row) {
                    return row['DCA_CODE'] == findMaxList[i][1]
                });
            }
            console.log(topData);

            for (var i = 0; i < 10; i++) {
                places[i] = new Array();
                for (var j = 0; j < topData[i].length; j++) {
                    places[i].push(new google.maps.LatLng(topData[i][j]['LATITUDE'], topData[i][j]['LONGITUDE']));
                }
            }
            console.log(places);
            changeMarker();
            //make all results into string
            var paraString;
            stringList = new Array();
            var stringList = new Array();
            for (i = 0; i < 10; i++) {
                stringList[stringList.length] = 'The top ' + (i + 1) + ' accident reason in your area is: ' + findMaxList[i][1] + '</br>' + '    which caused ' + findMaxList[i][0] + ' accidents!' + '</br>';
            }
            var endString = 'That\'s all accidents in your area.';
            //if no accident or less than five kinds of accident found.
            if (findMaxList[0][0] <= 0) {
                paraString = 'No accidents found in your area!';
            } else if (findMaxList[1][0] <= 0) {
                paraString = stringList[0] + '</br>' + endString;
            } else if (findMaxList[2][0] <= 0) {
                paraString = stringList[0] + '</br>' + stringList[1] + '</br>' + endString;
            } else if (findMaxList[3][0] <= 0) {
                paraString = stringList[0] + '</br>' + stringList[1] + '</br>' + stringList[2] + '</br>' + endString;
            } else if (findMaxList[4][0] <= 0) {
                paraString = stringList[0] + '</br>' + stringList[1] + '</br>' + stringList[2] + '</br>' + stringList[3] + '</br>' + endString;
            } else if (findMaxList[5][0] <= 0) {
                paraString = stringList[0] + '</br>' + stringList[1] + '</br>' + stringList[2] + '</br>' + stringList[3] + '</br>' + stringList[4] + '</br>' + endString;
            } else if (findMaxList[6][0] <= 0) {
                paraString = stringList[0] + '</br>' + stringList[1] + '</br>' + stringList[2] + '</br>' + stringList[3] + '</br>' + stringList[4] + '</br>' + stringList[5] + '</br>' + endString;
            } else if (findMaxList[7][0] <= 0) {
                paraString = stringList[0] + '</br>' + stringList[1] + '</br>' + stringList[2] + '</br>' + stringList[3] + '</br>' + stringList[4] + '</br>' + stringList[5] + '</br>' + stringList[6] + '</br>' + endString;
            } else if (findMaxList[8][0] <= 0) {
                paraString = stringList[0] + '</br>' + stringList[1] + '</br>' + stringList[2] + '</br>' + stringList[3] + '</br>' + stringList[4] + '</br>' + stringList[5] + '</br>' + stringList[6] + '</br>' + stringList[7] + '</br>' + endString;
            } else if (findMaxList[9][0] <= 0) {
                paraString = stringList[0] + '</br>' + stringList[1] + '</br>' + stringList[2] + '</br>' + stringList[3] + '</br>' + stringList[4] + '</br>' + stringList[5] + '</br>' + stringList[6] + '</br>' + stringList[7] + '</br>' + stringList[8] + '</br>' + endString;
            } else {
                paraString = stringList[0] + '</br>' + stringList[1] + '</br>' + stringList[2] + '</br>' + stringList[3] + '</br>' + stringList[4] + '</br>' + stringList[5] + '</br>' + stringList[6] + '</br>' + stringList[7] + '</br>' + stringList[8] + '</br>' + stringList[9];
            }
            //put result on html page
            document.getElementById('para').innerHTML = paraString;
            console.log(findMaxList);
            document.getElementById('checkbox').style.visibility = "visible";
        },
        error: function() {}
    });
}

function findMax() {
    //find max and set the most frequent happened accident's number to zero, so that the next time find max's result will be the second largest number.
    max = -1;
    maxPoint = -1;
    findListIndex = -1;
    for (i = 0; i < nArray.length; i++) {
        if (nArray[i] > max) {
            max = nArray[i];
            maxPoint = i;

        }
    }
    nArray[maxPoint] = 0;
    findListIndex = findMaxList.length;
    findMaxList[findListIndex] = new Array();
    findMaxList[findListIndex][0] = max;
    findMaxList[findListIndex][1] = tArray[maxPoint];
    console.log("find 1 time");
}

function changeMarker() {
    deleteMarkers();
    var checkBox = document.getElementsByName("top");
    value = new Array();
    for (i = 0; i < 10; i++) {
        if (checkBox[i].checked) {
            value[i] = 1;
        } else {
            value[i] = 0;
        }
    }
    console.log(value);
    for (i = 0; i < 10; i++) {
        if (value[i] == 1) {
            for (var j = 0; j < places[i].length; j++) {
                // Creating a new marker
                markers[markers.length] = new google.maps.Marker({
                    position: places[i][j],
                    map: map,
                    title: 'Place number ' + i * 10 + j,
                    icon: icons[i],
                    size: new google.maps.Size(5, 5)
                });

                console.log("mark 1 time");  
            }
        }
    }

}
