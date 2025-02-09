const apiKey="08e132da97eeb832a51638c967e6273d";
const apiUrl="http://api.weatherstack.com/current";
// Elements
const searchBtn=document.getElementById("search-btn")
const currentLocationBtn=document.getElementById("current-location-btn")
const cityInput=document.getElementById("city-input")
const recentSelect=document.getElementById("recent-select")
const forecastCards=document.getElementById("forecast-cards")
const weatherIcon=document.getElementById("weather-icon")
const cityName=document.getElementById("city-name")
// prdefined cities
const cities=["Chennai","London","Mumbai","New York"];
// fetch weather data from API
const fetchWeatherData=async (city) =>{
    try{
        const response=await fetch(`${apiUrl}?access_key=${apiKey}&query=${city}`);
        const data= await response.json();
        if(data.error){
            throw new Error(data.error.info);
        }
        return data;
    }
    catch(error){
        console.error("Error Fetching Weather Data : ",error.message);
        alert(` Error : ${error.message}`);
    }
}
// Update UI with Current Weather Data
const updateCurrentWeather= (data)=>{
    if(!data || !data.current){
        alert("Invalid Data Received !")
        return ;
    }
    cityName.textContent=` Today's Weather - ${data.location.name}`;
    document.getElementById("temperature").textContent= `Temperature: ${data.current.temperature}°C`;
    document.getElementById("humidity").textContent= `Humidity: ${data.current.humidity}%`;
    document.getElementById("visibility").textContent= `Visibility: ${data.current.visibility} km`;
    document.getElementById("wind-speed").textContent= `Wind Speed: ${data.current.wind_speed} km/h`;
    document.getElementById("wind-direction").textContent=`Wind Direction: ${data.current.wind_dir}`;
    weatherIcon.src=data.current.weather_icons[0];
    weatherIcon.alt=data.current.weather_descriptions[0];
    document.getElementById("weather-condition").textContent=data.current.weather_descriptions[0];
} 
//  Fetch and Display Weather for Major Cities
const displayCitiesWeather=async ()=>{
    forecastCards.innerHTML="" // clear previous data
    for(let city of cities){
        const data= await fetchWeatherData(city);
        if(data){
            const card=document.createElement("div")
            card.classList.add("bg-white","text-gray-900","rounded-lg","shadow-lg","p-4","text-center","weather-card","w-52");
            card.innerHTML=`
            <h3 class="font-extrabold">${data.location.name}</h3>
        <img src="${data.current.weather_icons[0]}" alt="${data.current.weather_descriptions[0]}" class="w-16 h-16 mx-auto">
        <p class="font-bold">Condition: ${data.current.weather_descriptions[0]}</p>
        <p class="font-bold">Temp: ${data.current.temperature}°C</p>
        <p class="font-bold">Humidity: ${data.current.humidity}%</p>
        <p class="font-bold">Visibility: ${data.current.visibility} km</p>
        <p class="font-bold">Wind Speed: ${data.current.wind_speed} km/h</p>
        `;
        forecastCards.appendChild(card);
        }
    }
}
// search by city name
searchBtn.addEventListener("click",async () => {
    const city=cityInput.value.trim();
    if(!city){
        alert("Please Enter a City Name !");
        return;
    }
    const data=await fetchWeatherData(city);
    if(data){
        updateCurrentWeather(data)
        recentSelect.classList.remove("hidden");
        // add city to recentseach dropdown menu if not already added
        let optionExists=[...recentSelect.options].some(option =>option.value ===city)
        if(!optionExists){
            const option=document.createElement("option")
            option.value=city;
            option.textContent=city;
            recentSelect.appendChild(option);

        }
        cityInput.value=""; // clear input fields
    }
    // refresh major cities weather display
    displayCitiesWeather();

})
// fetch weather for user current location
currentLocationBtn.addEventListener("click",async ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async (position)=>{
            const {latitude,longitude}=position.coords;
            const data= await fetchWeatherData(`${latitude},${longitude}`);
            if(data){
                updateCurrentWeather(data);
            }
        },(error)=>{
            alert("Location access denied. Using Default City.");
            fetchWeatherData("Delhi").then(updateCurrentWeather);
        } );
    }
    else{
        alert("Geolocation is not Supported by this Browser.")
    }
});
// update whether when fetching from recent searches
recentSelect.addEventListener("change",async ()=>{
    const city=recentSelect.value;
    if(city){
        const data=await fetchWeatherData(city);
        if(data){
            updateCurrentWeather(data);
        }
    }
});
// load weather on page load
document.addEventListener("DOMContentLoaded",async ()=>{
    fetchWeatherData("Delhi").then(updateCurrentWeather);
    displayCitiesWeather();
});