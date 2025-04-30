import { getData, getStories } from "../../data/api";

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h2>Daftar Cerita</h2>
        <div id="storyList"></div>

        <h3>Peta Lokasi Cerita</h3>
        <div id="map" style="height: 300px; border-radius: 8px; margin-top: 1rem;"></div>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('token');
    // const stories = getStories(token);
    const response = await fetch('https://story-api.dicoding.dev/v1/stories?location=1', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    const storyList = document.getElementById('storyList');

    async function getAddress(lat, lon) {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
        const data = await res.json();
        return data.display_name || "Alamat tidak ditemukan";
      } catch {
        return "Alamat tidak ditemukan";
      }
    }

    const map = L.map('map').setView([-2.5, 117], 4.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    for (const story of data.listStory) {
      if (story.lat && story.lon) {
        const address = await getAddress(story.lat, story.lon);
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}<br><em>${address}</em>`);

        storyList.innerHTML += `
          <article>
            <img src="${story.photoUrl}" alt="Story by ${story.name}" />
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <small>${new Date(story.createdAt).toLocaleString()}</small>
            <p><em>${address}</em></p>
          </article>
        `;
      }
    }
  }
}
