async function loadListings() {
    const res = await fetch("./data/airbnb_sf_listings_500.json");
    const listings = await res.json();
  
    console.log("Loaded listings:", listings.length, listings[0]); // debug
  
    const first50 = listings.slice(0, 50);
  
    const container = document.getElementById("listings");
    container.innerHTML = first50.map(renderListing).join("");
  
    setupFavorites();
  }
  
  function renderListing(item) {
    let amenities = item.amenities;
    if (typeof amenities === "string") {
      try { amenities = JSON.parse(amenities); } catch { amenities = []; }
    }
    amenities = Array.isArray(amenities) ? amenities.slice(0, 10) : [];
  
    // Price 
    const price = item.price ? String(item.price).replace("$", "") : "N/A";
  
    return `
      <div class="listing">
        <h2>${item.name || "Untitled listing"}</h2>
  
        ${item.picture_url ? `<img class="thumbnail" src="${item.picture_url}" alt="${item.name}" />` : ""}
  
        <div class="description">
          ${item.description || ""}
        </div>
  
        <div class="host">
          ${item.host_picture_url ? `<img src="${item.host_picture_url}" alt="${item.host_name}" />` : ""}
          <h3>${item.host_name || "Unknown host"}</h3>
        </div>
  
        <div class="price">$${price} / night</div>
  
        <div class="amenities">
          <ul>
            ${amenities.map(a => `<li>${a}</li>`).join("")}
          </ul>
        </div>
  
        <!-- Creative addition -->
        <button class="favorite-btn" data-id="${item.id}">👍 Like</button>
      </div>
    `;
  }
  
  function setupFavorites() {
    document.querySelectorAll(".favorite-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  
        if (favs.includes(id)) {
          favs = favs.filter(x => x !== id);
          btn.textContent = "👍 Like";
        } else {
          favs.push(id);
          btn.textContent = "👍 Liked";
        }
  
        localStorage.setItem("favorites", JSON.stringify(favs));
      });
    });
  }
  
  loadListings();
  
