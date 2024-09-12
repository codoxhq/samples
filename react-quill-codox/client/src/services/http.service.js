import axios from "axios";
/**
 * Http requests service
 */
class HttpService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_HOST;
  }
  // reusable get
  async _get(url, options = {}) {
    const response = await axios.get(`${this.baseUrl}${url}`, options);
    return response.data;
  }

  // reusable post
  async _post(url, params = {}) {
    const response = await axios.post(`${this.baseUrl}${url}`, {
      ...params,
    });
    return response.data;
  }

  // reusable patch
  async _patch(url, params = {}) {
    const response = await axios.patch(`${this.baseUrl}${url}`, {
      ...params,
    });
    return response.data;
  }

  // reusable put
  async _put(url, params = {}) {
    const response = await axios.put(`${this.baseUrl}${url}`, {
      ...params,
    });
    return response.data;
  }

  async getDocumentById(id) {
    return await this._get(`/documents/${id}`);
  }

  // async updateDocumentContent({ docId, content }) {
  //   return await this._put(`/documents/${docId}/content`, { content });
  // }

  async updateDocumentContent({ meta, data }) {
    return await this._post(`/documents/update/content`, { meta, data });
  }

  async getAllDocumentsIds() {
    return await this._get(`/documents/`);
  }

  async getUserAccessToDocument({ email, docId }) {
    return await this._get(`/users/access/${email}/doc/${docId}`);
  }
}

export default new HttpService();
