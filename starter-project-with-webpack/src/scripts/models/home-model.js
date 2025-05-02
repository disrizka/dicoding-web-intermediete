import { getStories } from '../data/api.js';


export default class HomeModel {
  async fetchStories(token) {
    return await getStories(token);
  }
}
