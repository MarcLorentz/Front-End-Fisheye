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

function closeModale(e, overlay, modal) {
  e.preventDefault();
  overlay.setAttribute("aria-hidden", "true");
  modal.style.display = "none";
  overlay.style.display = "none";
}

function initModalForm(photographerElement) {
  //ouverture modale
  const overlay = document.querySelector(".overlay");
  const contactBtn = document.querySelector(".contact_button");
  const modal = document.getElementById("contact_modal");
  const photographerName = document.getElementById("photographerName");
  photographerName.innerText = photographerElement.name;
  const div = document.querySelector(".modalTitle");
  div.appendChild(photographerName);
  contactBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.setAttribute("aria-hidden", "false");
    modal.style.display = "block";
    overlay.style.display = "block";
  });
  //fermeture modale
  overlay.addEventListener("click", (e) => {
    closeModale(e, overlay, modal);
    modal.setAttribute("aria-hidden", "true");
  });
  const closeModal = document.querySelector(".close_modal");
  closeModal.addEventListener("click", (e) => {
    closeModale(e, overlay, modal);
    modal.setAttribute("aria-hidden", "true");
  });
  //elements modale
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
let mediasSorted = [];

//dropdown menu medias photographe
function handleFilters(photographerMedias, photographerElement) {
  const selectFilter = document.getElementById("filter");

  selectFilter.addEventListener("change", () => {
    if (selectFilter.value === "Popularité") {
      mediasSorted = photographerMedias.sort(function (a, b) {
        return b.likes - a.likes;
      });
    } else if (selectFilter.value === "Date") {
      mediasSorted = photographerMedias.sort(function (a, b) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else if (selectFilter.value === "Titre") {
      mediasSorted = photographerMedias.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }
    createMedias(photographerMedias, photographerElement);
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
  const photographerElement = photographers.photographers.find(
    (element) => element.id === photographerIdNumber
  );
  mediasSorted = photographerMedias;

  createMedias(photographerMedias, photographerElement);
  initModalForm(photographerElement);
  createPhotographerHeader(photographerElement);
  handleFilters(photographerMedias, photographerElement);
}

//affichage medias photographe Lightbox
function createMedia(media) {
  const lightboxContainer = document.querySelector(".lightboxContainer");
  if (media.video) {
    const video = document.createElement("video");
    const source = document.createElement("source");
    video.src = "assets/images/" + media.video;
    video.setAttribute("alt", media.title);
    video.append(source);
    video.controls = true;
    lightboxContainer.innerHTML = "";
    lightboxContainer.append(video);
    lightbox.setAttribute("aria-hidden", "false");
  } else {
    const image = document.createElement("img");
    image.src = "assets/images/" + media.image;
    image.alt = media.title;
    lightboxContainer.innerHTML = "";
    lightboxContainer.append(image);
    lightbox.setAttribute("aria-hidden", "false");
  }
  const lightboxTitle = document.querySelector(".title");
  lightboxTitle.innerText = media.title;
}
//navigation LIGHTBOX
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
//mise en place lightbox
const lightbox = document.querySelector(".lightbox_content");

//navigation Lightbox au clavier
window.addEventListener("keydown", function (event) {
  if (event.code === "ArrowRight") {
    displayNextMedia(mediasSorted, suivant);
    lightbox.setAttribute("aria-hidden", "false");
  } else if (event.code === "ArrowLeft") {
    displayLastMedia(mediasSorted, precedent);
    lightbox.setAttribute("aria-hidden", "false");
  } else if (event.code === "Escape") {
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.style.display = "none";
  }
});

//recup suivant
const suivant = document.querySelector(".suivant");
suivant.innerHTML = `<em class="fas fa-chevron-right"></em>`;
suivant.addEventListener("click", () => {
  displayNextMedia(mediasSorted, suivant);
});

//recup precedent
const precedent = document.querySelector(".precedent");
precedent.innerHTML = `<em class="fas fa-chevron-left"></em>`;
precedent.addEventListener("click", () => {
  displayLastMedia(mediasSorted, precedent);
});

function createMedias(medias, photographerElement) {
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
    const divElement = document.createElement("div");

    nbLikesSum = media.likes + nbLikesSum;

    //nbre de likes et coeur
    const heart = document.createElement("span");
    const a = document.createElement("a");
    divElement.appendChild(a);
    a.setAttribute("href", "#");
    a.setAttribute("tabindex", "0");
    a.setAttribute("aria-label", "likes");
    a.classList.add("fa-heart");
    a.classList.add("fas");
    a.addEventListener("click", (e) => {
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
    heart.appendChild(a);

    photographersBook.appendChild(divElement);

    //fermeture lightbox
    const closeLightbox = document.querySelector(".close_lightbox");
    closeLightbox.addEventListener("click", (e) => {
      e.preventDefault();
      lightbox.setAttribute("aria-hidden", "true");
      lightbox.style.display = "none";
    });

    const aContainingImgOrVideo = document.createElement("a");
    aContainingImgOrVideo.setAttribute("href", "#");

    if (media.video) {
      const video = document.createElement("video");
      video.setAttribute("alt", media.title);
      const source = document.createElement("source");
      video.src = "assets/images/" + media.video;
      video.append(source);
      aContainingImgOrVideo.addEventListener("click", () => {
        currentSelectedMedia = index;
        createMedia(media);
        const lightbox = document.querySelector(".lightbox_content");
        lightbox.style.display = "flex";
        lightbox.setAttribute("aria-hidden", "false");
      });
      aContainingImgOrVideo.appendChild(video);
    } else {
      const bookImg = media.image;
      const img = document.createElement("img");
      img.setAttribute("alt", media.title);
      img.src = "assets/images/" + bookImg;
      aContainingImgOrVideo.addEventListener("click", () => {
        currentSelectedMedia = index;
        createMedia(media);
        const lightbox = document.querySelector(".lightbox_content");
        lightbox.style.display = "flex";
        lightbox.setAttribute("aria-hidden", "false");
      });
      nbLikesContainer.innerHTML = ` ${nbLikesSum} <em class="fa-heart fas"></em>  ${photographerElement.price}€ / jour`;
      //DOM vignettes media
      aContainingImgOrVideo.appendChild(img);
    }
    divElement.appendChild(aContainingImgOrVideo);
    const div = document.createElement("div");
    div.classList.add("heart-container");
    divElement.appendChild(div);
    div.appendChild(mediaTitle);
    div.appendChild(mediaLikes);
    div.append(heart);
  });
}

getPhotographers();
