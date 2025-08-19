import api from '../api';
import axios from 'axios';

// Function to detect the language of the provided text
export const detectLanguage = async (texts) => {
    // console.log(texts)
  //   if (targetLang === 'deff') {
  //     return texts; // Return the texts unchanged
  // }
  // console.log(texts.map(text => ({ text })))
  const options = {
    method: 'POST',
    url: 'https://google-translator9.p.rapidapi.com/v2/detect',
    headers: {
      'x-rapidapi-key': api,
      'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: texts.map(q => ({ q })),
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data.data.detections[0][0].language)
    return response.data; // Return the detected languages
  } catch (error) {
    console.error("Error detecting language:", error);
    throw error; // Rethrow error to be handled by the calling function
  }
};

// Function to translate the provided text to a target language
export const translateText = async (texts, targetLang, detectLang) => {
  if (targetLang === 'deff') {
    return texts; // Skip translation if default
  }

  const delimiter = '&&'; // Delimiter to separate strings
  const combinedText = texts.join(delimiter); // Combine all texts into one string

  const options = {
    method: 'POST',
    url: 'https://google-translator9.p.rapidapi.com/v2',
    headers: {
      'x-rapidapi-key': api,
      'x-rapidapi-host': 'google-translator9.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      q: combinedText,
      source: detectLang,
      target: targetLang,
      format: 'text',
    },
  };

  try {
    const response = await axios.request(options);
    const translatedString = response.data.data.translations[0].translatedText;
    const translatedArray = translatedString.split(delimiter); // Split translated string back into array

    return translatedArray;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
};
