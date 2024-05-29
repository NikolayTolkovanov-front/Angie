document.addEventListener("DOMContentLoaded", async () => {
  function getPathToImage(pathToStatic, imgName, fileExtension) {
    return pathToStatic + `${imgName}.${fileExtension}`;
  }

  async function checkImg(pathToStatic, imgName, fileExtension) {
    const imgUrl = getPathToImage(pathToStatic, imgName, fileExtension);
    const res = await fetch(imgUrl)
    return res.ok
  }

  const pathToStatic = window.location.pathname.slice(0, 3) + "/_static/"

  const newsDataEl = $("#news-data");
  const newsDataText = newsDataEl.text();
  newsDataEl.remove();

  if(!newsDataText){return}

  const parsedNews = JSON.parse(newsDataText);

  var container = $("#pagination-news");
  container.pagination({
    dataSource: parsedNews,
    pageSize: 4,
    showPageNumbers: true,
    showPrevious: false,
    showNext: false,
    ulClassName: 'pagination',
    // pageClassName: 'page-item',
    // activeClassName: 'active',
    // disableClassName: '',
    callback: async function (data, pagination) {
      var dataHtml = '<ul class="news-page__list">';

      for (let item of data) {
        const isPngExists = await checkImg(pathToStatic, `img/${item.articleImageName}`, 'png')
        const isWebpExists = await checkImg(pathToStatic, `img/${item.articleImageName}`, 'webp')
        const pathToWebp = getPathToImage(pathToStatic, `img/${item.articleImageName}`, 'webp')
        const pathToPng = getPathToImage(pathToStatic, `img/${item.articleImageName}`, 'png')

        let imageBlock = `
        <div class="news-card__image">
          <picture>
            <source
              srcset="${pathToWebp}"
              type="image/webp"
            />
            <img src="${pathToPng}" alt="" />
          </picture>
        </div>
        `

        if (!isPngExists) {
          imageBlock = ''
        }

        let tagsBlock = ''
        for (let tag of item.tags.split(', ')) {
          tagsBlock += `<li>${tag}</li>`
        }

        const listItem = `
          <li>
            <a href="${item.link}.html" class="news-card">
              <div class="news-card__content">
                <span class="news-card__date">${item.date}</span>
                <h2 class="news-card__title">${item.articleTitle}</h2>
                <p class="news-card__description">${item.cardDescriptionText}</p>
                <div class="news-card__labels">
                  <ul>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="M18.7883 10.8461L11.0289 3.08672C10.9421 2.99954 10.8388 2.93042 10.7251 2.88336C10.6114 2.83629 10.4895 2.81221 10.3664 2.8125H3.125C3.04212 2.8125 2.96264 2.84543 2.90403 2.90403C2.84543 2.96264 2.8125 3.04212 2.8125 3.125V10.3664C2.81221 10.4895 2.83629 10.6114 2.88336 10.7251C2.93042 10.8388 2.99954 10.9421 3.08672 11.0289L10.8461 18.7883C10.9332 18.8757 11.0367 18.945 11.1506 18.9923C11.2646 19.0397 11.3868 19.064 11.5102 19.064C11.6335 19.064 11.7557 19.0397 11.8697 18.9923C11.9836 18.945 12.0871 18.8757 12.1742 18.7883L18.7906 12.1719C18.878 12.0848 18.9474 11.9813 18.9947 11.8673C19.042 11.7534 19.0664 11.6312 19.0664 11.5078C19.0664 11.3844 19.042 11.2623 18.9947 11.1483C18.9474 11.0343 18.878 10.9309 18.7906 10.8438L18.7883 10.8461ZM18.3461 11.7297L11.7297 18.3461C11.6711 18.4045 11.5917 18.4374 11.509 18.4374C11.4262 18.4374 11.3469 18.4045 11.2883 18.3461L3.52891 10.5867C3.47051 10.5283 3.43764 10.449 3.4375 10.3664V3.4375H10.3664C10.449 3.43764 10.5283 3.47051 10.5867 3.52891L18.3461 11.2883C18.4045 11.3469 18.4374 11.4262 18.4374 11.509C18.4374 11.5917 18.4045 11.6711 18.3461 11.7297ZM7.1875 6.5625C7.1875 6.68612 7.15085 6.80695 7.08217 6.90973C7.01349 7.01252 6.91588 7.09262 6.80168 7.13993C6.68748 7.18723 6.56181 7.19961 6.44057 7.17549C6.31933 7.15138 6.20797 7.09185 6.12056 7.00444C6.03315 6.91704 5.97363 6.80567 5.94951 6.68443C5.9254 6.5632 5.93777 6.43753 5.98508 6.32333C6.03238 6.20912 6.11249 6.11151 6.21527 6.04283C6.31805 5.97416 6.43889 5.9375 6.5625 5.9375C6.72826 5.9375 6.88723 6.00335 7.00444 6.12056C7.12165 6.23777 7.1875 6.39674 7.1875 6.5625Z"
                        fill="#C3BEBE"
                      />
                    </svg>
                    ${tagsBlock}
                  </ul>
                </div>
              </div>
              ${imageBlock}
            </a>
          </li>
        `;
        dataHtml += listItem;
      }

      dataHtml += "</ul>";

      container.prev().html(dataHtml);
    },
  });
});
