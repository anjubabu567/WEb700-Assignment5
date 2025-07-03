/********************************************************************************
* WEB700 – Assignment 03
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Anju Babu Student ID: 115640245 Date: 14-06-2025
*
********************************************************************************/

const setData = require("../data/setData");
const themeData = require("../data/themeData");

class legoData {
  constructor() {
    this.sets = [];
  }

  initialize() {
    return new Promise((resolve, reject) => {
      try {
        setData.forEach(set => {
          const theme = themeData.find(t => t.id === set.theme_id);
          this.sets.push({
            ...set,
            theme: theme ? theme.name : "Unknown"
          });
        });
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

  // New method: addSet(newSet) 
  addSet(newSet) {
    return new Promise((resolve, reject) => {
      // Check if set_num already exists 
      const existingSet = this.sets.find(set => set.set_num === newSet.set_num);
      if (existingSet) {
        return reject("Set already exists"); // Reject if set_num exists 
      }

      // Add the newSet to the sets array 
      // Important: Assign a theme name based on theme_id before pushing
      const theme = themeData.find(t => t.id === Number(newSet.theme_id)); // theme_id might be string, convert to number
      this.sets.push({
        ...newSet,
        theme: theme ? theme.name : "Unknown"
      });
      resolve(); // Resolve if successful 
    });
  }
}

module.exports = legoData;