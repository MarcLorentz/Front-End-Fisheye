function mediaFactory(type, media) {
  let mediaSource;

  if (type === "image") {
    mediaSource = document.createElement("img");
    mediaSource.src = "assets/images/" + media.image;
    mediaSource.alt = media.title;
  } else if (type === "video") {
    mediaSource = document.createElement("video");
    const source = document.createElement("source");
    mediaSource.src = "assets/images/" + media.video;
    mediaSource.setAttribute("alt", media.title);
    mediaSource.append(source);
    mediaSource.controls = true;
  }

  return mediaSource;
}
//export { mediaFactory };
