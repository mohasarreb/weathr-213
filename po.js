const API_KEY = "aecdc1ccd7f453eadcdec7d574feef2b";

document.getElementById("searchBox").addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        getWeather(e.target.value);
    }
});

function changeBackground(desc) {
    const bg = document.querySelector(".weather-bg");

    
    const rainWords = ["rain", "مطر", "رذاذ", "shower"];
    const cloudWords = ["cloud", "غيوم", "غائم"];
    const clearWords = ["clear", "صاف", "صافي"];
    const stormWords = ["thunder", "عاصفة", "رعد"];
    const snowWords = ["snow", "ثلج"];
    const fogWords = ["fog", "ضباب", "mist", "غبار"];

    if (rainWords.some(w => desc.includes(w))) {
        bg.style.backgroundImage = "url('ممطر.jpg')";
    }
    else if (cloudWords.some(w => desc.includes(w))) {
        bg.style.backgroundImage = "url('غائم.jpg')";
    }
    else if (clearWords.some(w => desc.includes(w))) {
        bg.style.backgroundImage = "url('صافي.jpg')";
    }
    else if (stormWords.some(w => desc.includes(w))) {
        bg.style.backgroundImage = "url('رعد.jpg')";
    }
    else if (snowWords.some(w => desc.includes(w))) {
        bg.style.backgroundImage = "url('متلج.jpg')";
    }
    else if (fogWords.some(w => desc.includes(w))) {
        bg.style.backgroundImage = "url('ضباب.jpg')";
    }
    else {
        bg.style.backgroundImage = "url('اخرى.jpg')";
    }
}


async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&lang=ar&units=metric&appid=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    const container = document.getElementById("forecast");
    container.innerHTML = "";

   
    for (let i = 0; i < 40; i += 8) {
        const item = data.list[i];

        container.innerHTML += `
        <div class="card">
            <h3>${item.dt_txt.split(" ")[0]}</h3>
            <p>${Math.round(item.main.temp)}°C</p>
            <p>${item.weather[0].description}</p>
        </div>
        `;
    }
}


function showMapWithWeather(lat, lon, icon, temp, desc) {
    if (window.myMap) {
        window.myMap.remove(); 
    }

    window.myMap = L.map('map').setView([lat, lon], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(window.myMap);

    
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    
    const popupContent = `
        <div style="text-align:center;">
            <img src="${iconUrl}" width="60">
            <h3>${temp}°C</h3>
            <p>${desc}</p>
        </div>
    `;

    
    L.marker([lat, lon]).addTo(window.myMap)
        .bindPopup(popupContent)
        .openPopup();
        
 

}



async function getWeather(city) {
    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=ar&appid=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    
    document.getElementById("cityDisplay").textContent = `${data.name}, ${data.sys.country}`;
    
    const today = new Date();
    document.getElementById("dateDisplay").textContent =
        today.toLocaleDateString("ar", { month: "long", day: "numeric" });

    document.getElementById("tempDisplay").textContent =
        Math.round(data.main.temp) + "°";
     showMapWithWeather(
    data.coord.lat,
    data.coord.lon,
    data.weather[0].icon,
    Math.round(data.main.temp),
    data.weather[0].description
);
   
    getForecast(city);
    
    
    changeBackground(data.weather[0].description.toLowerCase());

  

}


