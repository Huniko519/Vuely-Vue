<template>
    <div class="today-weather d-custom-flex align-items-center mb-3">
        <i class="font-3x mr-3" :class="weatherIcon"></i>
        <div>
            <p class="mb-0 fs-12 grey--text">{{city}}, {{country}}</p>
            <h4 class="mb-0 fw-light text-capitalize">{{temp}}&deg; {{weatherDescription}}</h4>
        </div>
    </div>
</template>

<script>
import moment from "moment";
import ApiService from "@/common/api.service";
import { mapState } from "vuex";

// function to get today weather icon
function getIcon(id) {
    if (id >= 200 && id < 300) {
        return "wi wi-night-showers";
    } else if (id >= 300 && id < 500) {
        return "wi day-sleet";
    } else if (id >= 500 && id < 600) {
        return "wi wi-night-showers";
    } else if (id >= 600 && id < 700) {
        return "wi wi-day-snow";
    } else if (id >= 700 && id < 800) {
        return "wi wi-day-fog";
    } else if (id === 800) {
        return "wi wi-day-sunny";
    } else if (id >= 801 && id < 803) {
        return "wi wi-night-partly-cloudy";
    } else if (id >= 802 && id < 900) {
        return "wi wi-day-cloudy";
    } else if (id === 905 || (id >= 951 && id <= 956)) {
        return "wi wi-day-windy";
    } else if (id >= 900 && id < 1000) {
        return "wi wi-night-showers";
    }
}

export default {
    data: function() {
        return {
            city: "Mumbai",
            country: "India",
            temp: "",
            weatherDescription: "",
            weatherIcon: "",
            currentTime: moment().format("dddd DD MMMM"),
            lat: 0,
            long: 0
        };
    },
    mounted() {
        var appid = "b1b15e88fa797225412429c1c50c122a1"; // Your api id
        var apikey = "69b72ed255ce5efad910bd946685883a"; // Your apikey
        var city = this.getAuthUser("city", "address"); // city name
        var lat = 0;
        var long = 0;
        var self = this;

        getweather(self, "q=" + city);

        console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);

        function getweather(self, param) {
            ApiService.get(
                "http://api.openweathermap.org/data/2.5/weather?" +
                    param +
                    "&cnt=6&units=metric&mode=json&appid=" +
                    appid +
                    "&apikey=" +
                    apikey
            ).then(response => {
                self.city = response.name;
                self.country = response.sys.country;
                self.temp = response.main.temp;
                self.weatherDescription = response.weather[0].description;
                self.weatherIcon = getIcon(response.weather[0].id);
            });
        }
    }
};
</script>