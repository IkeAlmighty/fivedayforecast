import crypto from "crypto";
import { readFile, writeFile } from "fs/promises";

// Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string = City.generateId(name)) {
    this.name = name;
    this.id = id;
  }

  // used to create unique ids for cities.
  static generateId(seed: string): string {
    return crypto
      .createHash("md5")
      .update(Date.now() + seed)
      .digest("hex");
  }
}

// Complete the HistoryService class
class HistoryService {
  // Define a read method that reads from the searchHistory.json file
  private async read() {
    const fileContents: string = await readFile("../server/db/db.json", {
      encoding: "utf-8",
    });

    return fileContents;
  }
  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await writeFile("../server/db/db.json", JSON.stringify(cities));
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities: City[] = JSON.parse(await this.read());
    return cities;
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string) {
    // get the full list of cities from the json file
    let cities: City[] = JSON.parse(await this.read());

    // create a new city. This does not care about cityName collisions (cities often have the same name)
    const newCity: City = new City(cityName);
    cities.push(newCity);
    this.write(cities);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const fileContents = await this.read();

    //read the cities in:
    let cities: City[] = JSON.parse(fileContents);

    // delete the city with the matching id
    cities = cities.filter((city) => city.id !== id);
    this.write(cities);
  }
}

export default new HistoryService();
