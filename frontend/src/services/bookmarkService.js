import { api } from './api.js';

export const bookmarkService = {
  listBookmarks() {
    return api.get('/bookmarks');
  },

  addBookmark(itemType, itemId) {
    return api.post('/bookmarks', { item_type: itemType, item_id: itemId });
  },

  removeBookmark(bookmarkId) {
    return api.delete(`/bookmarks/${bookmarkId}`);
  },
};
