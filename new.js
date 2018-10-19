var map = new google.maps.Map(document.getElementById('map'), {
center: {lat: -37.9172708, lng: 145.1251862},
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
var dataset;
var dataPiece;
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
// top five accident reason arrray
var first = new Array();
var second = new Array();
var third = new Array();
var fourth = new Array();
var fifth = new Array();

var inputStart = document.getElementById('start');
    var inputEnd = document.getElementById('end');
    var autocompleteStart = new google.maps.places.Autocomplete(inputStart);
    var autocompleteEnd = new google.maps.places.Autocomplete(inputEnd);

function deleteMarkers() {
//Loop through all the markers and remove
for (var i = 0; i < markers.length; i++) {
markers[i].setMap(null);
}
markers = [];
places = [];
console.log("remove");
console.log(markers);
console.log(places);
};


function startMap()
//detect user's choice of search a positon or a route
{
    address = document.getElementById("start").value;
    destination = document.getElementById("end").value;
        //console.log(address);
        //console.log(destination);
    if (destination == "")
    {
        singlePoint();
    }
    else
    {
        withDes();
    }
}


function withDes()
//if user search a route
{

    var geocoder;
    var point ;
    var sign = true;
    geocoder = new google.maps.Geocoder();
    address = document.getElementById("start").value;
    destination = document.getElementById("end").value;
    geocoder.geocode({'address':address},function(results,status){
        if(status==google.maps.GeocoderStatus.OK){
            //if reveive google's information of start position, get latitude and longtitude of this position
            point = results[0].geometry.location.toJSON();
            lat = point.lat;
            lng = point.lng;
            //zoom a bit to ensure SURROUNDINGS is included
            latMin = lat - 0.005;
            latMax = lat + 0.005;
            lngMin = lng - 0.005;
            lngMax = lng + 0.005;
            console.log(latMin);
            console.log(latMax);
            console.log(lngMin);
            console.log(lngMax);
            //after get start position's data, try destination one
           geocoder = new google.maps.Geocoder();

             geocoder.geocode({'address':destination},function(results,status){
                if (status==google.maps.GeocoderStatus.OK) {
                     point = results[0].geometry.location.toJSON();
                    desLat=point.lat;
                    desLng=point.lng;
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
                    myCallback();

                }
                else
                {
                     alert("Wrong address!");
                    sign = false;

                }
            })
        }
        else
                {
                     alert("Wrong address!");
                    sign = false;

                }


    })
    if(sign == true)
    {

    }

};

function myCallback()
//after get two point's longtitude and lantitude, use their zoom longtitude and latitude to select the largest rectangle on the map
{
        finalLatMax = -9999;
        finalLatMin = 9999;
        if(finalLatMax < latMax)
        {
            finalLatMax = latMax;
        }
        if(finalLatMax < desLatMax)
        {
            finalLatMax = desLatMax;
        }
        if(finalLatMin > latMin)
        {
            finalLatMin = latMin;
        }
        if(finalLatMin > desLatMin)
        {
            finalLatMin = desLatMin;
        }
        finalLngMax = -9999;
        finalLngMin = 9999;
        if(finalLngMax < lngMax)
        {
            finalLngMax = lngMax;
        }
        if(finalLngMax < desLngMax)
        {
            finalLngMax = desLngMax;
        }
        if(finalLngMin > lngMin)
        {
            finalLngMin = lngMin;
        }
        if(finalLngMin > desLngMin)
        {
            finalLngMin = desLngMin;
        }
        console.log('final');
        console.log(finalLatMin);
        console.log(finalLatMax);
        console.log(finalLngMin);
        console.log(finalLngMax);
        //run search after get the largest rectangle area
        search();
}

function singlePoint() {
    //run when user only input their start position

    var geocoder;
    var point ;
    geocoder = new google.maps.Geocoder();
    address=document.getElementById("start").value;
    geocoder.geocode({'address':address},function(results,status){
        if(status==google.maps.GeocoderStatus.OK){
            //if reveive google's information of start position, get latitude and longtitude of this position
            point = results[0].geometry.location.toJSON();
            lat = point.lat;
            lng = point.lng;
            //zoom a bit
            finalLatMin = lat - 0.005;
            finalLatMax = lat + 0.005;
            finalLngMin = lng - 0.005;
            finalLngMax = lng + 0.005;
            console.log(finalLatMin);
            console.log(finalLatMax);
            console.log(finalLngMin);
            console.log(finalLngMax);
            //after get information run search
            search();
        }
        else
        {
            alert("Wrong Address!");
        }
    })
};

function search()
{
    var cenlat = (finalLatMin+finalLatMax)/2;
    var cenlng = (finalLngMin+finalLngMax)/2;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: cenlat, lng: cenlng},
        zoom: 14
    });
    console.log("second");
    console.log(markers);
    if(markers.length>0)
        {
             deleteMarkers();
        }
     d3.csv("crash_8.27_modified.csv",function (passData) {
        data = passData;
        console.log(data);
        dataPiece = data.filter(function (row) {
            return row['LONGITUDE'] >= finalLngMin && row['LONGITUDE'] <= finalLngMax && row['LATITUDE'] >= finalLatMin && row['LATITUDE'] <= finalLatMax
        });
        console.log(dataPiece);
         for(i=0;i<dataPiece.length;i++)
             {
                   places.push(new google.maps.LatLng(dataPiece[i]['LATITUDE'], dataPiece[i]['LONGITUDE']));

             }
          markers = new Array();
         for (var i = 0; i < places.length; i++) {

        // Creating a new marker

        markers[markers.length] = new google.maps.Marker({

            position: places[i],

            map: map,

            title: 'Place number ' + i

        });

    }
        //array to store accident's name
                var tArray = new Array();
                //array to store how many times all kind of accident happend.
                var nArray = new Array();
                //group by all accidents by their reasons
                for(i = 0; i < dataPiece.length; i++)
                {
                    var sign = 0;
                    var pos = -1;
                    for(j = 0; j < tArray.length; j++)
                    {
                        if(dataPiece[i]['DCA_CODE'] == tArray[j])
                        {
                            sign = 1;
                            pos = j;
                        }
                    }
                    if (sign == 0)
                    {
                        tArray[tArray.length] = dataPiece[i]['DCA_CODE'];
                        nArray[nArray.length] = 1;
                    }
                    if (sign == 1)
                    {
                        nArray[pos] = nArray[pos] + 1;
                    }
                }

                console.log(tArray);
                console.log(nArray);
                //find max number of accident for first time and store
                var max = -1;
                var maxPoint = -1;
                for(i = 0;i < nArray.length; i++)
                {
                    if(nArray[i] > max)
                    {
                        max = nArray[i];
                        maxPoint = i;

                    }
                }
                //set the most frequent happened accident's number to zero, so that the next time find max's result will be the second largest number.
                nArray[maxPoint] = 0;
                first[0] = max;
                first[1] = tArray[maxPoint];
                //second time find max
                max = -1;
                maxPoint = -1;

                        for(i = 0;i < nArray.length; i++)
                {
                    if(nArray[i] > max)
                    {
                        max = nArray[i];
                        maxPoint = i;

                    }
                }
                nArray[maxPoint] = 0;
                second[0] = max;
                second[1] = tArray[maxPoint];
                //third time find max
                max = -1;
                maxPoint = -1;

                        for(i = 0;i < nArray.length; i++)
                {
                    if(nArray[i] > max)
                    {
                        max = nArray[i];
                        maxPoint = i;

                    }
                }
                nArray[maxPoint] = 0;
                third[0] = max;
                third[1] = tArray[maxPoint];
                //fourth time find max
                max = -1;
                maxPoint = -1;

                        for(i = 0;i < nArray.length; i++)
                {
                    if(nArray[i] > max)
                    {
                        max = nArray[i];
                        maxPoint = i;

                    }
                }
                nArray[maxPoint] = 0;
                fourth[0] = max;
                fourth[1] = tArray[maxPoint];
                //fifrth time find max
                max = -1;
                maxPoint = -1;

                        for(i = 0;i < nArray.length; i++)
                {
                    if(nArray[i] > max)
                    {
                        max = nArray[i];
                        maxPoint = i;

                    }
                }
                nArray[maxPoint] = 0;
                fifth[0] = max;
                fifth[1] = tArray[maxPoint];
                max = -1;
                maxPoint = -1;
                //make all results into string
                var paraString;
                var firstString = 'The top 1 accident reason in your area is: ' + first[1] + '</br>' + '    which caused ' + first[0] + ' accidents!' + '</br>';
                var secondString = 'The top 2 accident reason in your area is: ' + second[1] + '</br>' + '    which caused ' + second[0] + ' accidents!' + '</br>';
                var thirdString =    'The top 3 accident reason in your area is: ' + third[1] + '</br>' + '    which caused ' + third[0] + ' accidents!' + '</br>';
                var fourthString = 'The top 4 accident reason in your area is: ' + fourth[1] + '</br>' + '    which caused ' + fourth[0] + ' accidents!' + '</br>';
                var fifthString =  'The top 5 accident reason in your area is: ' + fifth[1] + '</br>' + '    which caused ' + fifth[0] + ' accidents!' + '</br>';
                var endString = 'That\'s all accidents in your area.';
                //if no accident or less than five kinds of accident found.
                if(first[0]<=0)
                {
                    paraString = 'No accidents found in your area!';
                }
                else if(second[0]<=0)
                {
                    paraString = firstString + '</br>' + endString;
                }
                else if(third[0]<=0)
                {
                    paraString = firstString + '</br>' + secondString + '</br>' + endString;
                }
                else if(fourth[0]<=0)
                {
                    paraString = firstString + '</br>' + secondString + '</br>' + thirdString + '</br>' + endString;
                }
                else if(fifth[0]<=0)
                {
                    paraString = firstString + '</br>' + secondString + '</br>' + thirdString + '</br>' + fourthString + '</br>' + endString;
                }
                else
                {
                    paraString = firstString + '</br>' + secondString + '</br>' + thirdString + '</br>' + fourthString + '</br>' + fifthString;
                }
                //put result on html page
                document.getElementById('para').innerHTML = paraString;

                console.log(first);
                console.log(second);
                console.log(third);
                console.log(fourth);
                console.log(fifth);

    });
};
