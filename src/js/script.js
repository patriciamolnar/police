"use strict";

//doc loaded.
$(document).ready(function() {
  //Dynamically adding year options to select menu
  var currentDate = new Date(); 
  var currentYear = currentDate.getFullYear();
 
  var years = []; 
  years.push(currentYear); 

  for(var i = 1; i <= 3; i++) {
    years.push(currentYear - i); 
  }

  $.each(years, function (i, year) {
    $('#year').append($('<option>', { 
        value: year,
        text : year
    }));
});
  
  //Global Variables
  var clrs = [
    '#669ccc', 
    '#ffcc33', 
    '#264F73'
  ];

  var labelDescriptions = {
    'Controlled drugs': '<span class="label-title">Controlled Drugs</span>&nbsp;refer to prescription drugs ' + 
      'listed in the Misuse of Drugs Act 1971. Such drugs include for example: Cocaine, LSD and Morphine.<br/>' +

      'You can see the most common one\'s on gov.uk\'s' +  
      '<a href="https://www.gov.uk/government/publications/controlled-drugs-list--2/list-of-most-commonly-encountered-drugs-currently-controlled-under-the-misuse-of-drugs-legislation" target="_blank">' + 
      'List of commonly encountered drugs</a>', 

    'Offensive weapons': '<span class="label-title">Offensive weapons</span>&nbsp;are objects that have been made or adapted ' + 
			'with the intetion to cause injury to another individual, either by the carrier or by someone else. ' +
      'A few examples are: a conceiled knife, pepper spray and a knuckle duster. ', 
      
    'Criminal damage': '<span class="label-title">Criminal Damage</span>&nbsp;relates to an individual damaging ' +
      'or wanting to damage property belonging to another person without any right to do so, ' +
      'either by intent or recklessness.', 

    'Threatening conduct': '<span class="label-title">Threatening conduct:</span>&nbsp;any behaviour that is intended to ' +
      'threaten or cause harm an individual.', 

    'Article for use in theft': '<span class="label-title">Article for use in theft:</span>&nbsp;any object that ' + 
       'has been used or adapted for use in theft.', 

    'Stolen goods': '<span class="label-title">Stolen goods:</span>&nbsp;possession of property that has been dishonestly ' + 
       'taken from another person, without the intent of returning it.',  
    
    'Other': '<span class="label-title">Other:</span>&nbsp; Reason was not specified.'
  }
   
  var $mapContainer = $('#mapContainer');
  var $infoContainer = $('#infoContainer'); 
  
  //event listener: postcode entry
  var $inputField = $('#postcode'); 
  var $error = $('#error');

  $inputField.on(
    {blur: validateInput}
  ); 

  //validating postcode: 
  function validateInput() {
    var regex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1}[0-9]{1,2}[A-Z]{2}$/i;
    var inputValue = $(this).val().replace(/\s/g, '');

    if(inputValue.match(regex)) {
      $inputField.removeClass('error');
      $inputField.removeClass('error-border');
      $error.html('');
    }

    if(!inputValue.match(regex)) {
      $inputField.addClass('error');
      $inputField.addClass('error-border');
      $error.html("<span class='background'><span class='exclaim'>!</span> Invalid postcode</span>");
    }
  }

  //event listener: button click/tap
  var $button = $('button'); 
  $button.on(
    {click: getLatLon}, 
    {tap: getLatLon}
  )

  //get URL with postcode
  function getURL() { 
    var postcode = $('input').val().replace(/\s/g, '');
    return 'https://api.postcodes.io/postcodes/' + postcode;   
  }

  //call postcode API for lat lon
  function getLatLon() {

    //resetting both containers from previous map calls
    if($mapContainer.html() != " ") {
      $mapContainer.html(""); 
    }

    if($infoContainer.html() != " ") {
      $infoContainer.html("").css('padding-bottom', '0'); 
    }


    var url = getURL(); 

    $.ajax({
      url: url,
      contentType: "application/json",
      dataType: 'json',
      success: function(obj){
          //if success call police API
          var lon = obj.result.longitude; 
          var lat = obj.result.latitude;
          getData(lat, lon);
          
      }, 
      error: function(xhr){
        $inputField.addClass('error');
        $inputField.addClass('error-border');
        $error.html("<span class='background'><span class='exclaim'>!</span> Invalid postcode</span>");
        $button.blur();
      } 
    });
  }

  //call police API 
  function getData(lat, lon) {
    var lat = lat; 
    var lon = lon;
    var month = $('#month').val();
    var year = $('#year').val();
    
    var url = 'https://data.police.uk/api/stops-street?lat=' + lat + '&lng=' + lon + '&date=' + year + "-" + month; 

    $.ajax({
      url: url,
      type: 'GET',
      //contentType: "application/json",
      dataType: 'json',
      success: function(obj2){
          if(obj2.length === 0) { //if there is no stop and search data
            $inputField.addClass('error');
            $inputField.addClass('error-border');
            $error.html("<span class='background'><span class='exclaim'>!</span> There is no data for your postcode</span>");
            $button.blur();
          } else {
            $inputField.removeClass('error');
            $inputField.removeClass('error-border');
            $error.html('');
            var arr = []; 
            $.each(obj2, function(i, value) {
              arr[i] = [value.object_of_search, value.outcome_object.name];
            })
            formatData(arr);
          }
          
      }, 
      error: function(xhr){
        $inputField.addClass('error');
        $inputField.addClass('error-border');
        $error.html("<span class='background'><span class='exclaim'>!</span> No result for your selected date." + 
        " Data is only available for 3 years with a 2 month delay.</span>");
        $button.blur();
      } 
    });
  }

  //format Data for map
  function formatData(arr) {
    //data storage
    var result = [[], [], [], []];

    //getting x-Axis values & setting up y values.
    $.each(arr, function(i, val) {
      if($.inArray(val[0], result[0]) === -1) {
        result[0][result[0].length] = val[0];

        //filling y-Axis arrays with 0s for future calculations.
        result[1][result[1].length] = 0;
        result[2][result[2].length] = 0;
        result[3][result[3].length] = 0;
      }
    });
    
    //Getting y-Axis data 
    $.each(arr, function(i, val) {
      //for each crime type count how many arrests (y1)
      var $num = $.inArray(val[0], result[0]);
      result[1][$num]++; 

      //count arrests      
      if((/arrest/i).test(val[1])) {
        result[2][$num]++;
      }

      //count other resolutions
      if(!(/arrest/i).test(val[1]) && !(/no further action/i).test(val[1])) {
        result[3][$num]++;
      }
    });

    /* Merging stolen goods with 'Evidence of offences under the act*/

    if(result[0].indexOf("Evidence of offences under the Act") != -1) {
      var indexOfEvidence = result[0].indexOf("Evidence of offences under the Act");
      var indexOfTheaft = result[0].indexOf("Stolen goods");

      //remove "Evidence of offences under the Act" from x axis
      result[0].splice(indexOfEvidence, 1);

      var numOfSearches = result[1][indexOfEvidence];
      result[1][indexOfTheaft] += numOfSearches;

      var numOfArrests = result[2][indexOfEvidence];
      result[2][indexOfTheaft] += numOfArrests;

      var numOfOther = result[3][indexOfEvidence];
      result[3][indexOfTheaft] += numOfOther;

      //after merging values remove the count of "Evidence of offences under the act" from y axis"
      result[1].splice(indexOfEvidence, 1);
      result[2].splice(indexOfEvidence, 1);
      result[3].splice(indexOfEvidence, 1);

    }

    //Renaming Labels to be user-friendlier
    $.each(result[0], function(i, val) {
      if(val == null) {
        result[0][i] = "Other";
      }
      if(val === "Firearms") {
        result[0][i] = "Guns";
      }
      if(val === "Anything to threaten or harm anyone") {
        result[0][i] = "Threatening conduct";
      }
      if(val === "Articles for use in criminal damage") {
        result[0][i] = "Criminal damage";
      }
    });

    //Breaking up the x-axis names into arrays, so they fit without rotation:
    $.each(result[0], function(i, val){
      result[0][i] = val.split(" ");
    });
  
    getChart(result);
  }

  function getChart(arr) {
    var data = arr; 
    $mapContainer.html('');
    

    var $canvas = $('<canvas></canvas>');
     

    //check window size to determine whether desktop/mobile version should be displayed. 
    if (window.innerWidth < 900) {
      $canvas[0].height = 500;
    }
     
    var ctx = $canvas[0].getContext('2d');


    var myChart = new Chart(ctx, {
      type: 'horizontalBar', 
      data: {
        labels: data[0],
        datasets: [
        {
          label: '# of Stop and Searches',
          data: data[1],
          backgroundColor: clrs[0],
          borderWidth: 1
        },

        {
          label: '# of Arrests',
          data: data[2],
          backgroundColor: clrs[1],
          borderWidth: 1
        },

        {
          label: '# of Other resolutions**',
          data: data[3],
          backgroundColor: clrs[2],
          borderWidth: 1
        }

        ]
      },
      options: {
         legend: {
          labels: {
               fontColor: '#d9d9d9',
               fontFamily: 'Tahoma'
              }
           },
        scales: {
          yAxes: [{
              ticks: {
                  fontColor: '#d9d9d9', 
                  fontFamily: 'Tahoma', 
                  fontSize: '12'
              }
          }],
          xAxes: [{
                ticks: {
                    fontColor: '#d9d9d9', 
                    fontFamily: 'Tahoma', 
                    fontSize: '12',
                    maxRotation: 0,
                    minRotation: 0
                }
            }]
        } 
      }
    });

    //create title for the map 
    var $h3 = $('<div><h1 class="heading" style="width:250px;">Your results</h1></div>').addClass('header');
    
    $mapContainer.append($h3); 
    $mapContainer.append($canvas);

    //explanation what other resolution is. 
    var $other = $('<div><p class="other-resolution">**Other resolutions could be amongst others: a warning, summons or a ' + 
    '<a href="https://www.askthe.police.uk/content/Q760.htm" target="_blank">community resolution</a>' +
    '</p></div>');
    
    $mapContainer.append($other); 

    getInfo(data);

    //remove :focus styling from button so visitors know the button worked.
    $button.blur(); 
  
  }

  function getInfo(arr) {
    var data = arr; 
    $infoContainer.html("").css('padding-bottom', '0');

    //Converting x-axis ticks into one string again. 
    var names = [];
    $.each(data[0], function(i, val) {
      names[i] = val.join(" ")
    })

    $.each(names, function(i, val) {
      var $div = $('<div></div>').addClass('infoDiv');

      //label description
      var description = ''; 
      if(labelDescriptions[val]) {
        description = labelDescriptions[val];
      }

      var content = '<p class="title">' + val + '</p>' + 
        '<p><span class="square" style="background-color:' + clrs[0] + '"></span>&nbspNumber of Stops and Searches: ' + data[1][i] + '</p>' +
        '<p><span class="square" style="background-color:' + clrs[1] + '"></span>&nbspNumber of Arrest:  '+ data[2][i] + '</p>' + 
        '<p><span class="square" style="background-color:' + clrs[2] + '"></span>&nbspNumber of Other Resolutions: ' + data[3][i] + '</p>' + 
        '<p class="description">' + description + '</p>';
      
        $div.html(content); 

        $infoContainer.append($div).css('padding-bottom', '2rem');
    });

  }



});
