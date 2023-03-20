import axios from "axios";
import { Server } from "ws";
import { createWordFrequencyMap } from "./wordCounter";
import redisClient from "./redisClient";
import { BlogPost } from "./wordCounter";

/**
 * Fetch blog posts from the specified API endpoint.
 *
 * @returns {Promise<BlogPost[]>} A promise that resolves to an array of blog posts.
 */
export const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await axios.get(
      "https://www.thekey.academy/wp-json/wp/v2/posts"
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * Compare two word count maps for equality.
 *
 * @param {Record<string, number>} map1 - The first word count map.
 * @param {Record<string, number>} map2 - The second word count map.
 * @returns {boolean} True if the maps are equal, false otherwise.
 */
const isEqual = (map1: Record<string, number>, map2: Record<string, number>): boolean => {
  const keys1 = Object.keys(map1);
  const keys2 = Object.keys(map2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (map1[key] !== map2[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Fetch blog posts periodically and send the word count map to Redis
 * only if the data has changed since the last fetch.
 */
export const fetchBlogPostsPeriodically = () => {
  let previousWordCountMap: Record<string, number> = {};

  const processBlogPosts = async () => {
    const blogPosts = await fetchBlogPosts();
    const wordCountMap = createWordFrequencyMap(blogPosts);

    if (!isEqual(previousWordCountMap, wordCountMap)) {
      console.log("New data received - updating Redis");
      await redisClient.set("wordCountMap", JSON.stringify(wordCountMap));
      previousWordCountMap = wordCountMap;
    }
  };

  processBlogPosts();
  setInterval(processBlogPosts, 10000);
};
