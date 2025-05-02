import { getStories } from "../../data/api";
import { getAddress } from "../../data/location_api";
import { showFormattedDate } from "../../utils";

export default class HomePage {
  async render() {
    const isAuthenticated = !!localStorage.getItem('token');

    return `
      <section class="container">
        <h1>Story App</h1>
        
        ${!isAuthenticated ? `
          <div class="welcome-section">
            <div class="welcome-content">
              <h2>Share Your Stories</h2>
              <p>Join our community to share your experiences and discover amazing stories from around the world.</p>
              <div class="welcome-buttons">
                <a href="#/login" class="btn btn-primary">Login</a>
                <a href="#/register" class="btn btn-secondary">Register</a>
              </div>
            </div>
          </div>
        ` : `
          <div class="story-container">
            <h2>Stories</h2>
            <div id="story-list" class="story-list">
              <p id="loading">Loading stories...</p>
            </div>
          </div>

          <div class="map-container">
            <h2>Story Locations</h2>
            <div id="map" class="map"></div>
          </div>
        `}
      </section>
    `;
  }

  async afterRender() {
    const isAuthenticated = !!localStorage.getItem('token');
  
    if (isAuthenticated) {
      await this._loadStories();
  
      if (document.getElementById('map')) {
        await this._initMap();
      }
    }
  }
  

  async _loadStories() {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
      const storyListElement = document.getElementById('story-list');
      
      // Show loading state
      storyListElement.innerHTML = '<p>Loading stories...</p>';
      
      // Fetch stories using API module
      const response = await getStories(token);
      
      if (response.error) {
        storyListElement.innerHTML = `<p class="error-message">${response.message || 'Failed to load stories'}</p>`;
        return;
      }

      if (!response.listStory || response.listStory.length === 0) {
        storyListElement.innerHTML = '<p>No stories found</p>';
        return;
      }

      // Render stories
      storyListElement.innerHTML = '';
      for (const story of response.listStory) {
        const address = await getAddress(story.lat, story.lon);
      
        storyListElement.innerHTML += this._createStoryItemTemplate(story, address);
      }

      const storyItems = storyListElement.querySelectorAll('.story-item');
      storyItems.forEach(item => {
        item.addEventListener('click', () => {
          const storyId = item.dataset.id;
          window.location.hash = `#/story/${storyId}`;
        });
      });
    } catch (error) {
      console.error('Error loading stories:', error);
      document.getElementById('story-list').innerHTML = '<p class="error-message">Failed to load stories</p>';
    }
  }

  async _initMap() {
    try {
      const mapElement = document.getElementById('map');
      
      
      if (!window.L) {
        mapElement.innerHTML = '<p class="error-message">Map library not loaded</p>';
        console.error('Leaflet library not found. Make sure to include it in your HTML.');
        return;
      }
  
    
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.hash = '#/login';
        return;
      }
      
    
      try {
        const response = await getStories(token);
        
       
        if (response.error) {
          console.error('API returned error:', response.error, response.message);
          mapElement.innerHTML = `<p class="error-message">API error: ${response.message || 'Unknown error'}</p>`;
          return;
        }
        
        if (!response.listStory) {
          console.error('Response does not contain listStory property:', response);
          mapElement.innerHTML = '<p class="error-message">Invalid API response format</p>';
          return;
        }
        
       
        const map = L.map('map').setView([-2.5, 117], 4.5); // Indonesia 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
  
      
        const storiesWithLocation = response.listStory.filter(story => story.lat && story.lon);
        
        if (storiesWithLocation.length === 0) {
          const noLocationsMessage = document.createElement('div');
          noLocationsMessage.innerHTML = '<p class="map-message">No story locations available</p>';
          noLocationsMessage.style.position = 'absolute';
          noLocationsMessage.style.zIndex = '1000';
          noLocationsMessage.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
          noLocationsMessage.style.padding = '10px';
          noLocationsMessage.style.borderRadius = '5px';
          noLocationsMessage.style.top = '10px';
          noLocationsMessage.style.left = '10px';
          mapElement.appendChild(noLocationsMessage);
        } else {
          storiesWithLocation.forEach(story => {
            const marker = L.marker([story.lat, story.lon]).addTo(map);
            marker.bindPopup(`
              <strong>${story.name}</strong>
              <p>${story.description}</p>
              <small>${new Date(story.createdAt).toLocaleString()}</small>
              <br>
              <a href="#/story/${story.id}" class="map-story-link">View Story</a>
            `);
          });
        }
      } catch (apiError) {
        console.error('Error calling API directly:', apiError);
        mapElement.innerHTML = '<p class="error-message">Failed to load map data</p>';
      }
    } catch (error) {
      console.error('Overall map initialization error:', error);
      document.getElementById('map').innerHTML = '<p class="error-message">Failed to load map</p>';
    }
  }

  _createStoryItemTemplate(story, address) {
    return `
      <article class="story-item" data-id="${story.id}">
        <img 
          src="${story.photoUrl}" 
          alt="Story by ${story.name}" 
          class="story-image"
          onerror="this.onerror=null;this.src='https://placeholder.pics/svg/300x200/DEDEDE/555555/Image%20Not%20Available';"
        >
        <div class="story-content">
          <h3 class="story-title">${story.name}</h3>
          <p class="story-description">${story.description}</p>
          <small class="story-date">${showFormattedDate(story.createdAt)}</small>
          ${story.lat && story.lon ? 
            `<p class="story-location">
              <span class="location-icon">📍</span> 
              <span>${address}</span>
            </p>` : ''
          }
        </div>
      </article>
    `;
  }
}