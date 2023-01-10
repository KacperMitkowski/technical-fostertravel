import "./styles/main.css";
import { API_KEY, LOCAL_STORAGE_KEYS, PAGE_SIZES, CHARS_AMOUNT_FOR_ARTICLE_CONTENT, COUNTRIES } from "./constants/index";
import { convertDate, convertContentToShortText } from "./helpers/index"

const prepareHeader = () => {
  const header = document.createElement("h1");
  header.id = "main_header";
  header.innerHTML = `Wyświetlono ${localStorage.getItem("pageSize")} najnowszych wiadomości dla kraju: ${getCountryName(localStorage.getItem("language"))}`;
  
  if(document.contains(document.querySelector("#main_header"))) {
    document.querySelector("#main_header").remove();
    const item = document.querySelector("#countries_select");
    document.body.insertBefore(header, item)
  }
  else {
    document.body.appendChild(header);
  }
}

const getCountryName = (currentPrefix) => COUNTRIES.find(country => country.prefix === currentPrefix).localName;

const getCountries = () => {
  const options = document.createDocumentFragment();;

  COUNTRIES.forEach(country => {
    const option = document.createElement("option");
    option.textContent = country.localName;
    option.value = country.prefix;

    if(localStorage.getItem(LOCAL_STORAGE_KEYS[0]) !== null) {
      option.selected = localStorage.getItem(LOCAL_STORAGE_KEYS[0]) === country.prefix;
    }
    options.appendChild(option);
  })

  return options;
}

const handleClickedArticle = (article) => {
  window.open(article.url, '_blank').focus();
}

const selectChangeHandler = (event) => {
  localStorage.setItem(event.target.name, event.target.value);

  prepareHeader();
  getDataAndDisplay();
}

const getPageSizes = () => {
  const options = document.createDocumentFragment();;

  PAGE_SIZES.forEach(pageSize => {
    const option = document.createElement("option");
    option.textContent = pageSize;
    option.value = pageSize;
    if(localStorage.getItem(LOCAL_STORAGE_KEYS[1]) !== null) {
      option.selected = localStorage.getItem(LOCAL_STORAGE_KEYS[1]) == pageSize;
    }
    options.appendChild(option);
  })

  return options;
}

const handleInitialData = () => {
  localStorage.getItem(LOCAL_STORAGE_KEYS[0]) === null && localStorage.setItem(LOCAL_STORAGE_KEYS[0], COUNTRIES[0].prefix);
  localStorage.getItem(LOCAL_STORAGE_KEYS[1]) === null && localStorage.setItem(LOCAL_STORAGE_KEYS[1], PAGE_SIZES[0]);

  prepareHeader();
};

const getDataAndDisplay = () => {
  getData()
    .then((articles) => display(articles))
    .catch((error) => alert("error"));
};

const getData = () =>
  fetch(
    `https://newsapi.org/v2/top-headlines?country=${localStorage.getItem("language")}&pageSize=${localStorage.getItem("pageSize")}`,
    {
      headers: {
        "x-api-key": API_KEY,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => res.articles);

const display = (articles) => {
  const container = document.querySelector("#container");
  container.innerHTML = "";

  articles.forEach(article => {
    const photoDiv = document.createElement("div");
    photoDiv.className = "photo_div";
    const overlayDivTop = document.createElement("div");
    overlayDivTop.className = "overlay_div_top"
    overlayDivTop.onclick = () => handleClickedArticle(article);

    const overlayDivBottom = document.createElement("div");
    overlayDivBottom.className = "overlay_div_bottom";
    overlayDivBottom.onclick = () => handleClickedArticle(article);

    const articleTitle = document.createElement("h1");
    articleTitle.className = "article_title";
    articleTitle.innerText = article.title;
    
    const articleDate = document.createElement("h3");
    articleDate.className = "article_date";
    articleDate.innerText = convertDate(article.publishedAt);
    
    overlayDivTop.appendChild(articleTitle)
    overlayDivTop.appendChild(articleDate)

    const articleSummary = document.createElement("h3");
    articleSummary.className = "article_summary";
    articleSummary.innerText = article.urlToImage ? convertContentToShortText(article.content) : "";
    overlayDivBottom.appendChild(articleSummary);

    const img = document.createElement("img");
    img.className = "article_img";
    img.onclick = () => handleClickedArticle(article);
    img.src = article.urlToImage ? article.urlToImage : "../no-photo.jpg";
    img.alt = "NO PHOTO";
    photoDiv.appendChild(overlayDivTop);
    photoDiv.appendChild(overlayDivBottom);
    photoDiv.appendChild(img);    

    container.appendChild(photoDiv)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  handleInitialData();
  getDataAndDisplay();

  // prepare container
  const container = document.createElement('div');
  container.id = "container";

  // prepare selects
  const countriesSelect = document.createElement("select");
  countriesSelect.id = "countries_select";
  countriesSelect.name = LOCAL_STORAGE_KEYS[0];
  countriesSelect.onchange = selectChangeHandler;
  countriesSelect.appendChild(getCountries());

  const pageSizeSelect = document.createElement("select");
  pageSizeSelect.id = "pageSize_select";
  pageSizeSelect.name = LOCAL_STORAGE_KEYS[1];
  pageSizeSelect.onchange = selectChangeHandler;
  pageSizeSelect.appendChild(getPageSizes());

  // append to body
  document.body.appendChild(countriesSelect);
  document.body.appendChild(pageSizeSelect);
  document.body.appendChild(container);
});
