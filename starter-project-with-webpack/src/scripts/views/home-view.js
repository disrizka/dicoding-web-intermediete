import { showFormattedDate } from "../utils";
import { getAddress } from "../data/location_api";

export default class HomeView {
  getTemplate(isAuthenticated) {
    return `
      <section class="container">
        <h1>Story App</h1>
        ${!isAuthenticated ? `
          <div class="welcome-section">
            <h2>Share Your Stories</h2>
            <p>Join to explore stories from around the world.</p>
            <a href="#/login" class="btn btn-primary">Login</a>
            <a href="#/register" class="btn btn-secondary">Register</a>
          </div>
        ` : `
          <div class="story-container">
            <h2>Stories</h2>
            <div id="story-list">Loading stories...</div>
            <div class="map-container">
              <h2>Story Locations</h2>
              <div id="map"></div>
            </div>
        `}
      </section>
    `;
  }

  async renderStories(stories) {
    const container = document.getElementById('story-list');
    container.innerHTML = '';
    for (const story of stories) {
      const address = await getAddress(story.lat, story.lon);
      container.innerHTML += `
        <article class="story-item" data-id="${story.id}">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <small>${showFormattedDate(story.createdAt)}</small>
          ${story.lat && story.lon ? `<p>📍 ${address}</p>` : ''}
        </article>
      `;
    }
  }

  renderError(message) {
    document.getElementById('story-list').innerHTML = `<p class="error-message">${message}</p>`;
  }

  renderMap(stories) {
    const map = L.map('map').setView([-2.5, 117], 4.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    stories.filter(s => s.lat && s.lon).forEach(story => {
      const marker = L.marker([story.lat, story.lon]).addTo(map);
      marker.bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
    });
  }
}
