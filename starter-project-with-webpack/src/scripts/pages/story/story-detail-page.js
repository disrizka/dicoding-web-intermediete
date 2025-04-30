import { getStoryDetail } from '../../data/api';
import { showFormattedDate } from '../../utils';

export default class StoryDetailPage {
  async render() {
    return `
      <section class="container">
        <h2>Story Detail</h2>
        <div id="story-detail">Loading...</div>
      </section>
    `;
  }

  async afterRender() {
    const hash = window.location.hash;
    const id = hash.split('/')[2];
    const token = localStorage.getItem('token');

    try {
      const response = await getStoryDetail(id, token);
      if (response.error) {
        document.getElementById('story-detail').innerHTML = `<p class="error-message">${response.message}</p>`;
        return;
      }

      const story = response.story;
      document.getElementById('story-detail').innerHTML = `
        <article class="story-detail">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-image">
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <small>${showFormattedDate(story.createdAt)}</small>
        </article>
      `;
    } catch (error) {
      console.error(error);
      document.getElementById('story-detail').innerHTML = '<p class="error-message">Failed to load story</p>';
    }
  }
}
