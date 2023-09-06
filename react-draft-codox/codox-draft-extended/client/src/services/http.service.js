import axios from "axios";
/**
 * Http requests service
 */
class HttpService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_HOST;
    this.methods = {
      get: "get",
      post: "post",
      put: "put",
      patch: "patch",
      delete: "delete",
    };
  }

  async _request({ method, url, options }) {
    let response = {};
    if (method === this.methods.get) {
      response = await axios[method](`${this.baseUrl}${url}`, { ...options });
    } else {
      const { cancelToken, ...params } = options;
      response = await axios[method](`${this.baseUrl}${url}`, { ...params }, { cancelToken });
    }
    return response.data;
  }

  async getFirstDocument() {
    return await this._request({ method: this.methods.get, url: "/document" });
  }

  async getDocumentById(docId) {
    return await this._request({ method: this.methods.get, url: `/document/${docId}` });
  }
}

export default new HttpService();
