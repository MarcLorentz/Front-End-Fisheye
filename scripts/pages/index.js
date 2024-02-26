//import { getUserCardDOM } from "pages/photographer.js";

async function getPhotographers() {
  // Récupération fiches photographe JSON
  const reponse = await fetch("data/photographers.json");
  const photographers = await reponse.json();
  console.log(photographers.photographers);

  //Récupération de l'élément du DOM qui accueillera les fiches photographes
  photographers.photographers.forEach((element) => {
    console.log(element);
    const fichePortrait = `assets/images/${element.portrait}`;
    const img = document.createElement("img");
    img.alt = element.name;
    const a = document.createElement("a");
    a.href = "photographer.html?id=" + element.id;
    img.src = fichePortrait;
    //fichePortrait.innerHTML = "photographer.html" + window.location.href;
    const ficheTitle = document.createElement("h2");
    ficheTitle.innerText = element.name;
    const ficheCity = document.createElement("p");
    ficheCity.innerText = `${element.city}, ${element.country}`;

    const ficheTagline = document.createElement("em");
    ficheTagline.innerText = element.tagline;
    const fichePrice = document.createElement("span");
    fichePrice.innerText = `${element.price} €/jour`;
    //console.log(picture);
    const photographersSection = document.querySelector(
      ".photographer_section"
    );
    // console.log(photographersSection);
    const photographersLocation = document.querySelector(
      ".photographer_location"
    );
    const article = document.createElement("article");
    // console.log(article);
    photographersSection.appendChild(article);
    article.appendChild(photographersLocation);
    article.appendChild(a);
    //article.appendChild(p);
    a.appendChild(img);
    a.appendChild(ficheTitle);
    article.appendChild(ficheCity);

    article.appendChild(ficheTagline);
    article.appendChild(fichePrice);
  });
}

async function displayData(photographers) {
  const photographersSection = document.querySelector(".photographer_section");

  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();
    photographersSection.appendChild(userCardDOM);
  });
}

async function init() {
  // Récupère les datas des photographes
  const { photographers } = await getPhotographers();
  displayData(photographers);
}

init();
