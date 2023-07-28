const link = "http://api.weatherstack.com/current?access_key=631a727a00c20887047cc180e75e12df"

const root = document.getElementById("root")
const popup = document.getElementById("popup")
const textInput = document.getElementById("text-input")
const form = document.getElementById("form")
const popupClose = document.getElementById("close")

let defaultData = {
    city:"",
    feelslike: 0,
    temperature: 0,
    observationTime: "00:00 AM",
    isDay: "yes",
    weatherDescription: "",
    weatherIcon:"",
    properties: {
        cloudcover: {},
        humidity: {},
        windSpeed:{},
        pressure: {},
        uvIndex: {},
        visibility: {},
    }
}

// асинхронная функция (функция в фоновом режиме)
const fetchData = async () => {   
    const query = localStorage.getItem('query') || defaultData.city
    try{
        const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();

    const {
        current: {
            feelslike, 
            cloudcover, 
            temperature, 
            observation_time: observationTime, 
            humidity, 
            is_day:isDay, 
            pressure, 
            uv_index: uvIndex, 
            visibility, 
            weather_descriptions: 
            weatherDescription, 
            weather_icons:weatherIcon, 
            wind_speed:windSpeed
        },
        location :{
            name: city
        }
    } = data

    console.log(data)

    defaultData = {
        ...defaultData,
        city,
        feelslike,
        temperature,
        observationTime,
        isDay,
        weatherDescription: weatherDescription[0],
        weatherIcon,
        properties: {
            cloudcover: {
                title:'Облачность',
                value: `${cloudcover}%`,
                icon: 'cloud.png'
            },
            humidity:{
                title:'Влажность',
                value:`${humidity}%`,
                icon: 'humidity.png'
            } ,
            windSpeed:{
                title:'Скорость ветра',
                value:`${windSpeed}км/ч`,
                icon: 'wind.png'
            },
            pressure:{
                title:'Давление',
                value:`${pressure}мм рт. ст.`,
                icon: 'gauge.png'
            } ,
            uvIndex:{
                title:'Ультрафиолетовый <p>индекс</p>',
                value:`${uvIndex}W/м<sup>2</sup>`,
                icon: 'uv-index.png'
            } ,
            visibility:{
                title:'Видимость',
                value:`${visibility}м`,
                icon: 'visibility.png'
            } ,
        },
    };

    renderComponent()
    }
    catch(err){
        console.log(err)
    }

}

const renderProperties = (properties) => {
    return Object.values(properties).map(({title, value, icon}) =>{
        return `<div class="property">
                <div class="property-icon">
                    <img src="./img/icons/${icon}" alt="">
                </div>
                <div class="property-info">
                    <div class="property-info__value">${value}</div>
                    <div class="property-info__description">${title}</div>
                </div>
            </div>`
    }).join("")
}

const markUp = () =>{
    const { city, weatherIcon, weatherDescription, observationTime, temperature, isDay, properties} = defaultData;

    const containerClass = isDay === "yes" ? "is-day" : "";

    return `<div class="container ${containerClass}">
                <div class="top">
                    <div class="city">
                        <div class="city-subtitle">Weather Today in</div>
                        <div class="city-title" id="city">
                            <span>${city}</span>
                        </div>
                    </div>
                    <div class="city-info">
                        <div class="top-left">
                            <img class="icon" src="${weatherIcon}" />
                            <div class="description">${weatherDescription}</div>
                        </div>
                        <div class="top-right">
                            <div class="city-info__subtitle">as of ${observationTime}</div>
                            <div class="city-info__title">${temperature}°</div>
                        </div>
                    </div>
                </div>
                <div id="properties"> ${renderProperties(properties)}</div>
            </div>`;
}


  
const toggleClassPopup = () => {
    popup.classList.toggle("active");
};
  
  const renderComponent = () => {
    root.innerHTML = markUp();
  
    const city = document.getElementById("city");
    city.addEventListener("click", toggleClassPopup);
};

const handleInput = (e) =>{
    defaultData = {
        ...defaultData,
        city: e.target.value,

    }
}

const handleSubmit = (e) =>{
    e.preventDefault();
    const value = defaultData.city

    if (!value) return null
       
    localStorage.setItem('query', value )
    fetchData()
    toggleClassPopup()

}

form.addEventListener('submit', handleSubmit)
textInput.addEventListener("input", handleInput)

const closePopup = () =>{
    popup.classList.remove("active")
}
popupClose.addEventListener("click", closePopup)
fetchData()