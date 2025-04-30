import { addStory } from "../../data/api";

export default class AddStoryPage {
  async render() {
    return `
      <section class="container">
        <h2>Add New Story</h2>
        <form id="add-story-form" class="story-form">
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" required></textarea>
          </div>

          <div class="form-group">
            <label for="camera">Camera</label>
            <video id="camera-preview" autoplay playsinline width="300"></video>
            <canvas id="snapshot" style="display:none;"></canvas>
            <button type="button" id="capture-btn">Capture</button>
            <p id="camera-status" style="font-size: small; color: green;"></p>
          </div>

          <div class="form-group">
            <label>Click on Map to Select Location</label>
            <div id="map" style="height: 300px;"></div>
          </div>

          <input type="hidden" id="lat">
          <input type="hidden" id="lon">

          <div class="form-group">
            <button type="submit">Submit</button>
          </div>
          <p id="response-message"></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    const video = document.getElementById("camera-preview");
    const canvas = document.getElementById("snapshot");
    const captureBtn = document.getElementById("capture-btn");
    const statusEl = document.getElementById("camera-status");
    let stream = null;
    let imageBlob = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      video.srcObject = stream;
      statusEl.textContent = "Camera started ✅";
    } catch (err) {
      statusEl.textContent = "Camera error ❌";
      console.error("Camera error:", err);
    }

    captureBtn.addEventListener("click", () => {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        imageBlob = blob;
        statusEl.textContent = "Image captured ✅";
        // Stop camera stream after capture
        stream.getTracks().forEach(track => track.stop());
      }, "image/jpeg");
    });

    // Leaflet map
    const map = L.map("map").setView([-2.5, 117], 4.5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    let marker = null;
    map.on("click", function (e) {
      const { lat, lng } = e.latlng;
      document.getElementById("lat").value = lat;
      document.getElementById("lon").value = lng;

      if (marker) map.removeLayer(marker);
      marker = L.marker([lat, lng]).addTo(map);
    });

    // Submit form
    const form = document.getElementById("add-story-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const description = document.getElementById("description").value;
      const lat = document.getElementById("lat").value;
      const lon = document.getElementById("lon").value;
      const token = localStorage.getItem("token");
      const message = document.getElementById("response-message");

      if (!imageBlob) {
        message.textContent = "Please capture an image first.";
        return;
      }
      if (!lat || !lon) {
        message.textContent = "Please select a location.";
        return;
      }

      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", imageBlob, "snapshot.jpg");
      formData.append("lat", lat);
      formData.append("lon", lon);

      try {
        const response = await addStory(formData, token);
        if (response.error) {
          message.textContent = response.message;
        } else {
          message.textContent = "Story added successfully!";
          window.location.hash = "#/";
        }
      } catch (err) {
        message.textContent = "Failed to submit story.";
      }
    });
  }
}
