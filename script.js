'use strict';

//Get element by id and class 
const btnGetIp = document.getElementById("getIp-btn");
const btnGetLatAndLng = document.getElementById("getLatAndLng");
const inputLatitude = document.getElementById("input-Latitude");
const inputLongitude = document.getElementById("input-Longitude");
const countriesContainer = document.querySelector(".countries");
const mes = document.getElementById("messenge");

///////////////////////////////////////

//RenderCountry function
//Get data json form promise and render  
const renderCountry = function (data, className = '') {
    countriesContainer.innerHTML = "";
    const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flag}" />
      <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)} people</p>
        <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
        <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
      </div>
    </article>
    `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  };


//Get information country by latitude value and longitude value, using geocode.xyz API
const whereAmI = async function (lat, lng){
    await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(response => {
        console.log(response);
        if(!response.ok){
            throw new Error(`location not found (${response.status})`)// Catch error if promise not reject
        }
        return response.json()})
    .then(async data => {
        console.log(data);
        mes.innerHTML = `This location is ${data.city}, ${data.country}`;
        return await fetch(`https://restcountries.com/v2/name/${data.country}`)
    })
    .then(res => {
      // console.log(res);
        if(!res.ok) throw new Error(`Please input again, location not found(${res.status})`);// Catch error if promise not reject

        return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => mes.innerHTML = `${err.message}`)
};


//restcountries.com API 
// https://restcountries.com/v2/name/germany

//Test case
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);
// whereAmI(21.028511, 105.804817);
// whereAmI(35.652832, 139.839478);

//Get information country from User IP
const checkIP = async function(){
  await fetch('https://ipapi.co/json/') //Get IP information by ipapi.co API
  .then(function(response) {
    return response.json();
  })
  .then(async function(data) {
      console.log(data);
      mes.innerHTML = `You are in ${data.city}, ${data.country_name}`;
      return await fetch(`https://restcountries.com/v2/name/${data.country_name}`)
  }).then(res => {
      if(!res.ok) throw new Error(`Country not found(${res.status})`); // Catch error if promise not reject

      return res.json();
  })
  .then(data => renderCountry(data[0]))
  .catch(err => mes.innerHTML = `${err.message}`)
}

//Test case
// checkIP();


//"Check location by your IP" event
btnGetIp.addEventListener("click", function(){
  checkIP();
  inputLatitude.value = "";
  inputLongitude.value = "";
});


//"Check location by your Latitude and Longitude" event
btnGetLatAndLng.addEventListener("click", function(){

  //validate Latitude and Longitude input value
  const regexLat = `^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$` //regex check Latitude
  const regexLng = `^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$` //regex check Longitude

  if(inputLatitude.value == "" && inputLongitude.value == ""){
    mes.innerHTML = "Please input Latitude and Longitude";
  }else if(!(inputLatitude.value.match(regexLat)) && !(inputLongitude.value.match(regexLng))){
    mes.innerHTML = "Latitude and Longitude of type is wrong !";
  }else {
    //if validate ok, call function.
    whereAmI(inputLatitude.value, inputLongitude.value);
    mes.innerHTML = "";
  }
})
