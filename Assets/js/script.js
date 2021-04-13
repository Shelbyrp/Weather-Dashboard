//Create the Weather Key and the var for the weather location input
var searchWeather = $(".searchWeather");
//Shelby's Weather API key
var apiWeatherKey = "7d048ecfdbf1cc65d6af8dd3e30acc27";

// Adding the list of cities in location storage and creating a button for those cities
function addHistory(city) {
    let cities = JSON.parse(localStorage.getItem("cities"));
    if (!cities) {
        cities = []
    }
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
        createButton(city);
    }
}

//Creating the list of cities from local storage and creating buttons
function loadHistory() {
    let cities = JSON.parse(localStorage.getItem("cities"));
    if (!cities) {
        cities = []
    }
    cities.map(function (i) {
        cities.push(i);
        localStorage.setItem("cities", JSON.stringify(cities));
        createButton(i);
    })
}

//Call on the load history function
loadHistory();

// Key count for local storage 
var keyCount = 0;
// Search button click event to generate the weather details for current day and 5 days

//Display the current weather in the browser and calling the API key
function renderWeather(searchInput) {
    var currentDay = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiWeatherKey + "&units=metric";
    // Five day forecast key used
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
                // Invoking the add history function with the parameter for the city
                addHistory(location.name);
                // Start Current Weather append by creating a div class and adding this to the card for current forecast
                var currentForecast = $(".currentDay").append("<div>").addClass("card-body");
                currentForecast.empty();
                var currentName = currentForecast.append("<p>");
                currentForecast.append(currentName);
                // Display the current day on the browser and show the icon as well
                var currentDate = new Date(location.dt * 1000);
                currentName.append("<h3>" + location.name + " " + currentDate.toLocaleDateString("en-AU") + "<h3>");
                currentName.append(`<img src="https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png">`);
                // Create the element for the temperature and then append it to the list as celsius
                var currentTemp = currentName.append("<p>");
                currentName.append(currentTemp);
                currentTemp.append("<p>" + "Temperature: " + location.main.temp + " °C" + "</p>");
                // Append the hunmidity as an element
                currentTemp.append("<p>" + "Humidity: " + location.main.humidity + "%" + "</p>");
                // Append the windspeed as an element
                currentTemp.append("<p>" + "Wind Speed: " + location.wind.speed + "</p>");
                // Generate the uvIndex based on the users input
                var uvIndex = `https://api.openweathermap.org/data/2.5/uvi?appid=b8ecb570e32c2e5042581abd004b71bb&lat=${location.coord.lat}&lon=${location.coord.lon}`;
                // Get the uvIndex from the API and then append it to the page
                fetch(uvIndex, {
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

        // Fetch the forecast and then display the 5 days to the browser, including the icon
        fetch(fiveDayForecast, {
            url: fiveDayForecast,
            method: "GET"
        })
            .then((response) => {
                return response.json();
            })
            .then(function (location) {
                var day = [0, 8, 16, 24, 32];
                var fiveDayDisplay = $(".fiveDay").addClass("card-text");
                fiveDayDisplay.empty();
                day.forEach(function (i) {
                    var FiveDayListing = new Date(location.list[i].dt * 1000);
                    FiveDayListing = FiveDayListing.toLocaleDateString("en-AU");
                    fiveDayDisplay.append("<div class=forecastColor>" + "<h4>" + FiveDayListing + "</h4>" + `<img src="https://openweathermap.org/img/wn/${location.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + location.list[i].main.temp + "</p>" + "<p>" + "Wind: " + location.list[i].wind.speed + "</p>" + "<p>" + "Humidity: " + location.list[i].main.humidity + "%" + "</p>" + "</div>");
                })
            });
    }
};

//Create buttons for the list items created from the users input
function createButton(city) {
    var cityName = $(".list-group").addClass("list-group-item");
    let button = $(`<button>${city}</button>`);
    button.click(function (e) {
        let city = e.target.textContent;
        renderWeather(city);
    });
    cityName.append(button);
}

//Add the event listener to the search button to then render the weather to the page, passing the users input
searchWeather.click(function () {
    renderWeather($(".searchInput").val())
});
