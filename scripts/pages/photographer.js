//Récupération de la chaîne de requête dans l'URL
const photographerUrl = window.location.search;

//Récuperation id photographe
const urlSearchParams = new URLSearchParams(photographerUrl);
const photographerId = urlSearchParams.get("id");
const photographerIdNumber = parseInt(photographerId);

function createPhotographerHeader(photographerElement) {
  //Récupération DOM  des fiches photographes
  const photographersSection = document.querySelector(".photograph_header");
  const ficheTitle = document.createElement("h3");
  ficheTitle.innerText = photographerElement.name;
  const ficheCity = document.createElement("p");
  ficheCity.innerText = `${photographerElement.city}, ${photographerElement.country}`;
  const ficheTagline = document.createElement("em");
  ficheTagline.innerText = photographerElement.tagline;
  const fichePortrait = `assets/images/${photographerElement.portrait}`;
  const img = document.createElement("img");
  img.src = fichePortrait;
  img.alt = photographerElement.name;
  const div = document.createElement("div");
  photographersSection.appendChild(div);
  div.appendChild(ficheTitle);
  div.appendChild(ficheCity);
  div.appendChild(ficheTagline);
  photographersSection.appendChild(img);
}

function handleModale(photographerElement) {
  //ouverture modale
  const overlay = document.querySelector(".overlay");
  const contact = document.querySelector(".contact_button");
  const modal = document.getElementById("contact_modal");
  const photographerName = document.getElementById("photographerName");
  photographerName.innerText = photographerElement.name;
  const div = document.querySelector(".modalTitle");
  div.appendChild(photographerName);
  contact.addEventListener("click", (e) => {
    e.preventDefault();
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "block";
    overlay.style.display = "block";
  });
  //fermeture modale
  overlay.addEventListener("click", (e) => {
    e.preventDefault();
    overlay.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    overlay.style.display = "none";
  });
  const closeModal = document.querySelector(".close_modal");
  closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    overlay.style.display = "none";
  });
  const firstName = document.getElementById("first_name");
  const lastName = document.getElementById("last_name");
  const email = document.getElementById("email");
  const yourMessage = document.getElementById("your_message");
  const submit = document.querySelector(".send_button");
  submit.addEventListener("click", (e) => {
    e.preventDefault();
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    overlay.style.display = "none";
    console.log(firstName.value);
    console.log(lastName.value);
    console.log(email.value);
    console.log(yourMessage.value);
  });
}

//dropdown menu medias photographe
function handleFilters(photographerMedia) {
  const selectFilter = document.getElementById("filter");

  selectFilter.addEventListener("change", () => {
    console.log(selectFilter.value);
    if (selectFilter.value === "Popularité") {
      photographerMedia.sort(function (a, b) {
        return b.likes - a.likes;
      });
    } else if (selectFilter.value === "Date") {
      photographerMedia.sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else if (selectFilter.value === "Titre") {
      photographerMedia.sort((a, b) => a.title.localeCompare(b.title));
    }
    createMedias(photographerMedia);
  });
}

async function getPhotographers() {
  //Récupération fiches photographe JSON
  const reponse = await fetch("data/photographers.json");
  const photographers = await reponse.json();
  //Récupération media photographe
  const photographerMedias = photographers.media.filter((media) => {
    return media.photographerId == photographerId;
  });
  console.log(photographerMedias);
  const photographerElement = photographers.photographers.find(
    (element) => element.id === photographerIdNumber
  );

  createMedias(photographerMedias, photographerElement);
  handleModale(photographerElement);
  createPhotographerHeader(photographerElement);
  handleFilters(photographerMedias);
}

//affichage medias photographe
function createMedia(media) {
  const mediaContainer = document.querySelector(".mediaContainer");
  if (media.video) {
    const video = document.createElement("video");
    const source = document.createElement("source");
    video.src = "assets/images/" + media.video;
    video.append(source);
    video.controls = true;
    mediaContainer.innerHTML = "";
    mediaContainer.append(video);
  } else {
    const image = document.createElement("img");
    image.src = "assets/images/" + media.image;
    mediaContainer.innerHTML = "";
    mediaContainer.append(image);
  }
  const lightboxTitle = document.querySelector(".title");
  lightboxTitle.innerText = media.title;
}
//LIGHTBOX
function displayNextMedia(medias, suivant) {
  suivant.setAttribute("aria-hidden", "true");
  currentSelectedMedia++;
  if (currentSelectedMedia > medias.length - 1) {
    currentSelectedMedia = 0;
  }
  const media = medias[currentSelectedMedia];
  createMedia(media);
}
function displayLastMedia(medias, precedent) {
  precedent.setAttribute("aria-hidden", "true");
  currentSelectedMedia--;
  if (currentSelectedMedia < 0) {
    currentSelectedMedia = medias.length - 1;
  }
  const media = medias[currentSelectedMedia];
  createMedia(media);
}
let currentSelectedMedia;
function createMedias(medias, photographerElement) {
  //mise en place lightbox
  const lightbox = document.querySelector(".lightbox_content");

  //navigation Lightbox au clavier
  window.addEventListener("keydown", function (event) {
    if (event.code === "ArrowRight") {
      displayNextMedia(medias, suivant);
    } else if (event.code === "ArrowLeft") {
      displayLastMedia(medias, precedent);
    } else if (event.code === "Escape") {
      lightbox.setAttribute("aria-hidden", "true");
      lightbox.style.display = "none";
    }
  });
  //recup suivant
  const suivant = document.querySelector(".suivant");
  suivant.innerHTML = `<em class="fas fa-chevron-right"></em>`;
  suivant.addEventListener("click", () => {
    displayNextMedia(medias, suivant);
  });

  //recup precedent
  const precedent = document.querySelector(".precedent");
  precedent.innerHTML = `<em class="fas fa-chevron-left"></em>`;
  precedent.addEventListener("click", () => {
    displayLastMedia(medias, precedent);
  });

  //je récupère l'élément dans lequel dans lequel on veut mettre le nb de likes
  const nbLikesContainer = document.querySelector(".total_likes");
  const photographersBook = document.querySelector(".gallery_container");
  photographersBook.innerHTML = "";
  let nbLikesSum = 0;
  medias.forEach((media, index) => {
    const titleMedia = media.title;
    const mediaTitle = document.createElement("p");
    const likesMedia = media.likes;
    const mediaLikes = document.createElement("p");
    mediaTitle.innerText = titleMedia;
    mediaLikes.innerHTML = likesMedia;
    const a = document.createElement("a");

    nbLikesSum = media.likes + nbLikesSum;

    //nbre de likes et coeur
    const heart = document.createElement("span");
    const em = document.createElement("em");
    a.appendChild(em);
    em.setAttribute("tabindex", "0");
    em.setAttribute("aria-label", "likes");
    em.classList.add("fa-heart");
    em.classList.add("fas");
    em.addEventListener("click", (e) => {
      e.preventDefault();
      if (!media.clicked) {
        media.likes++;
        mediaLikes.innerHTML = media.likes++;
        heart.innerHTML = `<em class="fa-heart fas" role="img" aria-label="likes" tabindex="0"></em> `;
        nbLikesSum++;
        media.clicked = true;
      }

      nbLikesContainer.innerHTML = `  ${nbLikesSum}   <em class="fa-heart fas"></em>  ${photographerElement.price}€ / jour `;
    });
    heart.appendChild(em);

    photographersBook.appendChild(a);

    //fermeture lightbox
    const closeLightbox = document.querySelector(".close_lightbox");
    closeLightbox.addEventListener("click", (e) => {
      e.preventDefault();
      lightbox.setAttribute("aria-hidden", "true");
      lightbox.style.display = "none";
    });

    if (media.video) {
      const video = document.createElement("video");
      video.setAttribute("tabindex", "0");
      video.setAttribute("alt", "");
      a.appendChild(video);
      const source = document.createElement("source");
      video.src = "assets/images/" + media.video;
      video.append(source);
      console.log(video);
      video.addEventListener("click", () => {
        currentSelectedMedia = index;
        createMedia(media);
        const lightbox = document.querySelector(".lightbox_content");
        lightbox.style.display = "flex";
      });
    } else {
      const bookImg = media.image;
      const img = document.createElement("img");
      img.setAttribute("tabindex", "0");
      img.setAttribute("alt", "media");
      img.src = "assets/images/" + bookImg;
      img.addEventListener("click", () => {
        currentSelectedMedia = index;
        createMedia(media);
        const lightbox = document.querySelector(".lightbox_content");
        lightbox.style.display = "flex";
      });

      //DOM vignettes media

      a.appendChild(img);
      console.log(a);
    }
    const div = document.createElement("div");
    a.appendChild(div);
    div.appendChild(mediaTitle);
    div.appendChild(mediaLikes);
    div.append(heart);
  });

  nbLikesContainer.innerHTML = ` ${nbLikesSum} <em class="fa-heart fas"></em>  ${photographerElement.price}€ / jour`;
}

getPhotographers();
