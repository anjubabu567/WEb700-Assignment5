/********************************************************************************
* WEB700 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Anju Babu Student ID: 115640245 Date: 17-07-2025
*
********************************************************************************/

const setData = require("../data/setData");
const themeData = require("../data/themeData");

class LegoData { 
  constructor() {
    this.sets = [];
    this.themes = [];
  }

  initialize() {
    return new Promise((resolve, reject) => {
      try {
        // Populate sets
        setData.forEach(set => {
          const theme = themeData.find(t => t.id === set.theme_id);
          this.sets.push({
            ...set,
            theme: theme ? theme.name : "Unknown"
          });
        });

        
        this.themes = [...themeData]; 

        resolve();
      } catch (error) {
        reject("Initialization failed: " + error);
      }
    });
  }

  getAllSets() {
    return new Promise((resolve, reject) => {
      if (this.sets.length > 0) {
        resolve(this.sets);
      } else {
        reject("No sets available");
      }
    });
  }

  getSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const foundSet = this.sets.find(set => set.set_num === setNum);
      if (foundSet) {
        resolve(foundSet);
      } else {
        reject(`Set number ${setNum} not found`);
      }
    });
  }

  getSetsByTheme(theme) {
    return new Promise((resolve, reject) => {
      const matchedSets = this.sets.filter(set =>
        set.theme.toLowerCase().includes(theme.toLowerCase())
      );
      if (matchedSets.length > 0) {
        resolve(matchedSets);
      } else {
        reject(`No sets found with theme: ${theme}`);
      }
    });
  }

 
  addSet(newSet) {
    return new Promise((resolve, reject) => {
    
      const existingSet = this.sets.find(set => set.set_num === newSet.set_num);
      if (existingSet) {
        return reject("Set already exists"); 
      }

      
      this.sets.push(newSet); 
      resolve(); // Resolve if successful 
    });
  }

  /**
   * Returns a Promise that resolves with the 'themes' array.
   * @returns {Promise<Array>} A promise that resolves with the array of themes.
   */
  getAllThemes() {
    return new Promise((resolve, reject) => {
      if (this.themes.length > 0) {
        resolve(this.themes);
      } else {
        reject("No themes available");
      }
    });
  }

  /**
   * Returns a Promise that resolves with the theme object matching the provided ID.
   * @param {number} id 
   * @returns {Promise<Object>} 
   */
  getThemeById(id) {
    return new Promise((resolve, reject) => {
      const foundTheme = this.themes.find(theme => theme.id === Number(id));
      if (foundTheme) {
        resolve(foundTheme);
      } else {
        reject("unable to find requested theme");
      }
    });
  }

  /**
   * Deletes a set by its set number.
   * @param {string} setNum - The set number of the set to delete.
   * @returns {Promise<void>} A promise that resolves if the set is deleted, or rejects if not found.
   */
  deleteSetByNum(setNum) {
    return new Promise((resolve, reject) => {
      const foundSetIndex = this.sets.findIndex(s => s.set_num === setNum);
      if (foundSetIndex !== -1) {
        this.sets.splice(foundSetIndex, 1);
        resolve(); // Resolve without data if successful
      } else {
        reject(`Set with set_num ${setNum} not found for deletion.`);
      }
    });
  }
}

module.exports = LegoData; 
