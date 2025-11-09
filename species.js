async function loadSpeciesData(country, species) {
  const response = await fetch(`data/${country}.json`);
  if (!response.ok) return null;
  const data = await response.json();
  return data[species] || null;
}

window.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const country = params.get("country")?.toLowerCase();
  const species = params.get("species")?.toLowerCase();

  const nameEl = document.getElementById("species-name");
  const gallery = document.getElementById("gallery");
  const fallback = document.getElementById("fallback");

  if (!country || !species) {
    nameEl.textContent = "No species selected";
    fallback.classList.remove("hidden");
    return;
  }

  nameEl.textContent = species.replace(/_/g, " ");
  const images = await loadSpeciesData(country, species);

  if (images) {
    images.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = species;
      gallery.appendChild(img);
    });
  } else {
    fallback.classList.remove("hidden");
  }
});
