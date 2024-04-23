async function displayPhotographerList() {
  // Récupération fiches photographe JSON
  const response = await fetch("data/photographers.json");
  const photographers = await response.json();

  //Récupération de l'élément du DOM qui accueillera les fiches photographes
  photographers.photographers.forEach((photographer) => {
    const fichePortrait = `assets/images/${photographer.portrait}`;
    const img = document.createElement("img");
    img.alt = photographer.name;
    const a = document.createElement("a");
    //lien hypertexte vers la page photographer.html avec l'identifiant du photographe inclus dans l'URL.
    // "photographer.html?id=" + photographer.id : valeur assignée à la propriété href. Cette partie de la ligne de code crée l'URL du lien. Elle concatène la chaîne "photographer.html?id=" avec la valeur de l'identifiant du photographe (photographer.id)
    a.href = "photographer.html?id=" + photographer.id;
    a.setAttribute("tabindex", "0");
    img.src = fichePortrait;
    const ficheTitle = document.createElement("h2");
    ficheTitle.innerText = photographer.name;
    const ficheCity = document.createElement("p");
    ficheCity.innerText = `${photographer.city}, ${photographer.country}`;

    const ficheTagline = document.createElement("em");
    ficheTagline.innerText = photographer.tagline;
    const fichePrice = document.createElement("span");
    fichePrice.innerText = `${photographer.price} €/jour`;
    const photographersSection = document.querySelector(
      ".photographer_section"
    );
    const photographersLocation = document.querySelector(
      ".photographer_location"
    );
    const article = document.createElement("article");
    photographersSection.appendChild(article);
    article.appendChild(photographersLocation);
    article.appendChild(a);
    a.appendChild(img);
    a.appendChild(ficheTitle);
    article.appendChild(ficheCity);
    article.appendChild(ficheTagline);
    article.appendChild(fichePrice);
  });
}

async function init() {
  await displayPhotographerList();
}

init();
