import { CHARS_AMOUNT_FOR_ARTICLE_CONTENT } from "../constants/index"

export const convertDate = (strDate) => {
    const date = new Date(strDate);
    const result =
    ("00" + (date.getMonth() + 1)).slice(-2) + "." +
    ("00" + date.getDate()).slice(-2) + "." +
    date.getFullYear() + " " +
    ("00" + date.getHours()).slice(-2) + ":" +
    ("00" + date.getMinutes()).slice(-2) + ":" +
    ("00" + date.getSeconds()).slice(-2);
  
    return result;
  }
  
export const convertContentToShortText = (str) => {
    if(str) {
      let trimmedString = str.substr(0, CHARS_AMOUNT_FOR_ARTICLE_CONTENT);
      trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + "..."; 
      return trimmedString;
    }
    return "No content";
  }