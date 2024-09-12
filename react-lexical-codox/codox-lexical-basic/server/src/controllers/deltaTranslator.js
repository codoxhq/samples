"use strict";

/**
 * Compose an action name based on the delta action and the collection being targeted.
 * @param {Object} delta - The delta object containing action and collections.
 * @returns {string} - The action name.
 * @throws {Error} - If data object is not defined or if target name is not defined.
 */
const getAction = (delta) => {
  if (!delta) {
    throw new Error("ERROR: getAction failed - delta is not defined");
  }

  const { action, data } = delta;
  if (!action || !data) {
    throw new Error("ERROR: getAction failed - action or data is not defined");
  }

  const target =
    data.source !== void 0
      ? data.source[data.source.length - 1]
      : data.collections[data.collections.length - 1];
  if (!target || !target.name) {
    throw new Error("ERROR: getAction failed - target name is not defined");
  }
  const targetName = target.name;
  const actionName = `${action}_${targetName}`.toUpperCase();

  console.log(`getAction: actionName ${actionName}`);
  return actionName;
};

/**
 * Returns the value of a property from the specified collection.
 * @param {string} key - The key to identify the collection.
 * @param {string} prop - The property name to retrieve the value.
 * @param {Array} collections - The array of collections to search for the value.
 * @returns {Any} - The value of the specified property from the collection.
 * @throws {Error} - If the matching prop value is not found or if key or prop is not defined.
 */
const getPropValue = (key, prop, collections) => {
  if (!key || !prop || !collections) {
    throw new Error("ERROR: getPropValue failed - key, prop or collections is not defined");
  }

  for (const collection of collections) {
    console.log("getPropValue: collection: ", collection);
    if (collection.name === key && collection[prop] !== void 0) {
      console.log(
        `getPropValue (out):collectionName = ${key}; prop = ${prop}; value = ${collection[prop]}`
      );
      return collection[prop];
    }
  }
  throw new Error(`ERROR: getPropValue (failed): key = ${key}; prop = ${prop}`);
};

/**
 * Returns the object to create/update from the specified data object.
 * @param {Object} data - The data object to retrieve the object to create.
 * @returns {Object} - The object to create.
 * @throws {Error} - If the object is not defined in the data object.
 */
const getObject = (data) => {
  if (!data) {
    throw new Error("ERROR: getObject failed - data is not defined");
  }

  if (data.object !== void 0) {
    console.log(`getObject (out): object  = `, data.object);
    return data.object;
  }
  throw new Error("ERROR: getObject failed - object is not defined in the data object");
};

/**
 * Returns codoxMeta info extracted from appMeta and data.
 * @param {Object} appMeta - The app meta object to retrieve the codox meta.
 * @param {Object} data - The data object to retrieve the topObjId.
 * @param {Object} codoxMeta - The object consisting of topObjId and codoxMeta.
 */
/*
const getCodoxMeta = (appMeta, data) => {
    // first get cdxMeta from appMeta (originally created by the app frontend for each codoxSync)
    // Note: this cdxMeta formation assumes cdxMeta-info is piggybacked/embedded inside appMeta, which may change in the future.
    const cdxMeta = {sts: appMeta.sts, to: appMeta.to}; 

    // second get top-level-object (representing the json doc state) id 
    const lastDelta = data[data.length-1]; 
    const lastCollections =  lastDelta.data.source !== void 0 ? lastDelta.data.source : lastDelta.data.collections;  
    const topObjName = lastCollections[0].name;
    const topObjId = getPropValue(topObjName, "id", lastCollections); 

    const codoxMeta = {topObjId, cdxMeta};  
    console.log(`getCodoxMeta (out):  codoxMeta = `, codoxMeta);
    return codoxMeta; 
}
*/

module.exports = {
  getAction,
  getPropValue,
  getObject,
  //getCodoxMeta,
};
