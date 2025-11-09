window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const speciesParam = params.get("species");
  const speciesNameEl = document.getElementById("species-name");
  const gallery = document.getElementById("gallery");
  const fallback = document.getElementById("fallback");

  if (!speciesParam) {
    speciesNameEl.textContent = "No species selected";
    fallback.classList.remove("hidden");
    return;
  }

  const species = speciesParam.toLowerCase();
  speciesNameEl.textContent = species.replace(/_/g, " ");

  // helper function: returns a Promise that resolves only if the image loads
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject();
      img.src = src;
    });
  };

  if (speciesData[species]) {
    const loaders = speciesData[species].map(src => loadImage(src)
      .then(img => {
        img.alt = species;
        gallery.appendChild(img);
      })
      .catch(() => {
        console.warn(`Image failed: ${src}`);
      })
    );

    // after all attempts, if nothing loaded, show fallback
    Promise.allSettled(loaders).then(results => {
      const successful = results.filter(r => r.status === "fulfilled").length;
      if (successful === 0) fallback.classList.remove("hidden");
    });

  } else {
    fallback.classList.remove("hidden");
  }
});
