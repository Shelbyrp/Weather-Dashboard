//Create the Weather Key
var searchWeather = $(".searchWeather");
var apiWeatherKey = "7d048ecfdbf1cc65d6af8dd3e30acc27";
var lastCity = "";

// Adding the list of cities from 
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

// Creating the list of cities from in local storage
function loadHistory() {
    let cities = JSON.parse(localStorage.getItem("cities"));
    cities.map(function (i) {
        createButton(i);
    })
}

loadHistory();

// Key count for local storage 
var keyCount = 0;
// Search button click event to generate the weather details for current day and 5 days

function renderWeather(searchInput) {
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
                addHistory(location.name);
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

        // Start call for 5-day forecast 
        fetch(fiveDayForecast, {
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
};

function createButton(city) {
    var cityName = $(".list-group").addClass("list-group-item");
    let button = $(`<button>${city}</button>`);
    button.click(function (e) {
        let city = e.target.textContent;
        renderWeather(city);
    });
    cityName.append(button);
}

searchWeather.click(function () {
    renderWeather($(".searchInput").val())
});
