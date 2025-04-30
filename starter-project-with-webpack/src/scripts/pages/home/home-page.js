import { getStories } from "../../data/api";
import { getAddress } from "../../data/location_api";
import { showFormattedDate } from "../../utils";

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Story App</h1>
        
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
      </section>
    `;
  }

  async afterRender() {
    await this._loadStories();
    await this._initMap();
  }

  async _loadStories() {
    try {
      // const token = localStorage.getItem('token');
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTREWDBlS1NseFhNMWRpMXkiLCJpYXQiOjE3NDU5Nzg1NjF9.CDQFrASiZz1cKy11rKCuDrFzWDa6_L-bQ--VmmKHH9c";
      localStorage.setItem('token', token);
      const tokenLS = localStorage.getItem('token');
      const storyListElement = document.getElementById('story-list');
      
      // Show loading state
      storyListElement.innerHTML = '<p>Loading stories...</p>';
      
      // Fetch stories using API module
      const response = await getStories(tokenLS || '');
      
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
      // Use for...of loop for async operations instead of forEach
      for (const story of response.listStory) {
        // Wait for address lookup to complete for each story
        const address = await getAddress(story.lat, story.lon);
      
        // Append the story with its address to the list
        storyListElement.innerHTML += this._createStoryItemTemplate(story, address);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
      document.getElementById('story-list').innerHTML = '<p class="error-message">Failed to load stories</p>';
    }
  }

  async _initMap() {
    try {
      const mapElement = document.getElementById('map');
      
      // Check if Leaflet is available
      if (!window.L) {
        mapElement.innerHTML = '<p class="error-message">Map library not loaded</p>';
        console.error('Leaflet library not found. Make sure to include it in your HTML.');
        return;
      }
  
      // Log map element to verify it exists
      console.log('Map element:', mapElement);
  
      // const token = localStorage.getItem('token');
      const token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTREWDBlS1NseFhNMWRpMXkiLCJpYXQiOjE3NDU5Nzg1NjF9.CDQFrASiZz1cKy11rKCuDrFzWDa6_L-bQ--VmmKHH9c";
      console.log('Using token:', token ? 'Token exists' : 'No token found');
      
      // Try using the API directly instead of the wrapper function for debugging
      try {
        // First attempt: Try using the function from api.js
        const response = await getStories(token || '');
        console.log('API response from getStories:', response);
        
        // Detailed checking of response
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
        
        // If we reach here, we have a valid response with stories
        
        // Initialize map
        const map = L.map('map').setView([-2.5, 117], 4.5); // Indonesia centered
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        
        console.log('Map initialized');
  
        // Add markers for stories with location data
        const storiesWithLocation = response.listStory.filter(story => story.lat && story.lon);
        console.log('Stories with location:', storiesWithLocation.length);
        
        if (storiesWithLocation.length === 0) {
          console.log('No stories with location found');
          // Don't replace the map with text, just show a message
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
            console.log('Adding marker for story:', story.id, 'at', story.lat, story.lon);
            const marker = L.marker([story.lat, story.lon]).addTo(map);
            marker.bindPopup(`
              <strong>${story.name}</strong>
              <p>${story.description}</p>
              <small>${new Date(story.createdAt).toLocaleString()}</small>
            `);
          });
        }
      } catch (apiError) {
        console.error('Error calling API directly:', apiError);
        
        // Fallback: Try direct fetch as a backup approach
        console.log('Attempting direct fetch as fallback...');
        try {
          const directResponse = await fetch('https://story-api.dicoding.dev/v1/stories?location=1', {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          const directData = await directResponse.json();
          console.log('Direct fetch response:', directData);
          
          if (directData.error) {
            mapElement.innerHTML = `<p class="error-message">API error: ${directData.message || 'Unknown error'}</p>`;
            return;
          }
          
          // Initialize map with direct fetch data
          const map = L.map('map').setView([-2.5, 117], 4.5);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(map);
          
          // Add markers from direct fetch
          const validStories = directData.listStory?.filter(story => story.lat && story.lon) || [];
          if (validStories.length === 0) {
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
            validStories.forEach(story => {
              const marker = L.marker([story.lat, story.lon]).addTo(map);
              marker.bindPopup(`
                <strong>${story.name}</strong>
                <p>${story.description}</p>
                <small>${new Date(story.createdAt).toLocaleString()}</small>
              `);
            });
          }
        } catch (directFetchError) {
          console.error('Direct fetch also failed:', directFetchError);
          mapElement.innerHTML = '<p class="error-message">Failed to load map data after multiple attempts</p>';
        }
      }
    } catch (error) {
      console.error('Overall map initialization error:', error);
      document.getElementById('map').innerHTML = '<p class="error-message">Failed to load map</p>';
    }
  }

  async _getAddress(){

  }

  _createStoryItemTemplate(story, address) {
    return `
      <article class="story-item">
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