//Create the Weather Key
var searchWeather = $(".searchWeather");
var apiWeatherKey = "7d048ecfdbf1cc65d6af8dd3e30acc27";

// Creating the list items from items in local storage
for (var i = 0; i < localStorage.length; i++) {
    var city = localStorage.getItem(i);
    var cityName = $(".list-group").addClass("list-group-item");
    cityName.append("<li>" + city + "</li>");
}
// Key count for local storage 
var keyCount = 0;
// Search button click event to generate the weather details for current day and 5 days
searchWeather.click(function () {
    var searchInput = $(".searchInput").val();
    var currentDay = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiWeatherKey + "&units=metric";
    // Variable for 5 day forecast working
    var fiveDayForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiWeatherKey + "&units=metric";

    if (searchInput == "") {
    } else {
        fetch(currentDay, {
            url: currentDay,
            method: "GET"
        })
    .then((response) => {
        return response.json();
    }).then(function (location) {
            // list-group append an li to it with just set text
            var cityName = $(".list-group").addClass("list-group-item");
            cityName.append("<li>" + location.name + "</li>");
            // Local storage
            var local = localStorage.setItem(keyCount, location.name);
            keyCount = keyCount + 1;
            // Start Current Weather append 
            var currentCard = $(".currentCard").append("<div>").addClass("card-body");
            currentCard.empty();
            var currentName = currentCard.append("<p>");
            // .addClass("card-text");
            currentCard.append(currentName);
            // Adjust Date 
            var timeUTC = new Date(location.dt * 1000);
            currentName.append("<h3>" + location.name + " " + timeUTC.toLocaleDateString("en-AU") + "<h3>");
            currentName.append(`<img src="https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png">`);
            // Add Temp 
            var currentTemp = currentName.append("<p>");
            // .addClass("card-text");
            currentName.append(currentTemp);
            currentTemp.append("<p>" + "Temperature: " + location.main.temp + " °C" + "</p>");
            // Add Humidity
            currentTemp.append("<p>" + "Humidity: " + location.main.humidity + "%" + "</p>");
            // // Add Wind Speed: 
            currentTemp.append("<p>" + "Wind Speed: " + location.wind.speed + "</p>");

            // UV Index URL
            var uvIndex = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${location.coord.lat}&lon=${location.coord.lon}`;

            // UV Index
            fetch(uvIndex,{
                url: uvIndex,
                method: "GET"
            })
            .then((response) => {
                return response.json();
            }).then(function (location) {
                var currentUV = currentTemp.append("<p>" + "UV Index: " + location.value + "</p>").addClass("card-text");
                currentUV.addClass("UV");
                currentTemp.append(currentUV);
            });
        });

        // Start call for 5-day forecast 
        fetch(fiveDayForecast,{
            url: fiveDayForecast,
            method: "GET"
        })
        .then((response) => {
            return response.json();
        })
        .then(function (location) {
            // Array for 5-days 
            var day = [0, 8, 16, 24, 32];
            var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
            fiveDayDiv.empty();
            // For each for 5 days
            day.forEach(function (i) {
                var FiveDayTimeUTC1 = new Date(location.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-AU");
                fiveDayDiv.append("<div class=fiveDayColor>" + "<h4>" + FiveDayTimeUTC1 + "</h4>" + `<img src="https://openweathermap.org/img/wn/${location.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + location.list[i].main.temp + "</p>" + "<p>" + "Wind: " + location.list[i].wind.speed + "</p>" + "<p>" + "Humidity: " + location.list[i].main.humidity + "%" + "</p>" + "</div>");
            })
        });
    }
});