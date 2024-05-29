(function isWebP() {
  function testWebP(callback) {
    let webP = new Image();
    webP.onload = webP.onerror = function () {
      callback(webP.height == 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  }
  testWebP(function (support) {
    if (support == true) {
      document.querySelector("html").classList.add("webp");
    } else {
      document.querySelector("html").classList.add("no-webp");
    }
  });
})();

const body = document.querySelector("body");
const header = document.querySelector(".header");

const serverPort = 8080
const isDev = false

const searchHeaderInput = document.querySelector(".header__search-input")
const searchHeaderButton = document.querySelector(".header__search-button")
const searchMainInput = document.querySelector(".search-main__input")
const searchMainButton = document.querySelector(".search-main__button")

const searchResults = document.querySelector(".search-page__list")

document.addEventListener("DOMContentLoaded", () => {
  headerWork();
  makeProductsLayout();
  searchInsert();
  highlightElement();
});

searchHeaderButton?.addEventListener("click", () => {
  makeSearch(searchHeaderInput)
})

searchMainButton?.addEventListener("click", () => {
  makeSearch(searchMainInput)
})

searchHeaderInput?.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') {
    makeSearch(searchHeaderInput);
  }
});

searchMainInput?.addEventListener("keydown", (event) => {
  if (event.key === 'Enter') {
    makeSearch(searchMainInput);
  }
});


function highlightElement() {
  const id = window.location.hash.substring(1);
  if (id) {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('highlight');
    }
  }
}

async function searchInsert() {
  try {
    if (window.location.pathname.includes("search")) {

      function insert(results) {
        results.forEach(item => {
          searchResults.innerHTML += `<li class="search-page__item search-result">
              <div class="search-result__title">
                <a href="${item.page}${item.meta_data?.id ? `#${item.meta_data?.id}` : ''}">${item.meta_data?.text}</a>
              </div>
          </li>`
        })
      }

      function notFound(type) {
        const notFoundElement = document.querySelector(".search-page__error")
        type ? notFoundElement.classList.remove("hidden") : notFoundElement.classList.add("hidden");
      }

      const url = `${window.location.origin}${window.location.pathname}`
      let searchText = window.location.href.replace(`${url}?query=`, "")

      searchHeaderInput.value = decodeURIComponent(searchText)
      searchMainInput.value = decodeURIComponent(searchText)

      searchText = encodeURIComponent(searchText)

      const basePath = `${window.location.protocol}//${window.location.hostname}`
      const serverUrl = `${basePath}${isDev ? `:${serverPort}/api/` : "/api/"}search?query=${searchText}&domain=${basePath}${isDev ? `:${window.location.port}` : ""}`

      const searchResponse = await fetch(serverUrl);

      if (!searchResponse.ok) {
        throw new Error('Network response was not ok');
      }
      const searchResult = await searchResponse.json()

      if (!searchResult.length) {
        notFound(true)
      }

      insert(searchResult)
    }


  } catch (error) {
    alert(`Error while try insert search data: ${error}`)
    throw error
  }
}

function makeSearch(inputElement) {

  try {

    const langue = window.location.pathname.substring(0, 4)

    const searchText = inputElement.value


    if (!searchText) {
      return
    }

    const params = `${langue}search/?query=${searchText}`

    window.location.href = params

  } catch (error) {
    alert(`Error while try to search: ${error}`)
    throw error
  }
}

function makeProductsLayout() {
  const list = document.querySelector(".products-main__list");
  const items = document.querySelectorAll(".products-main__item");
  if (list && items?.length === 4) {
    list.classList.add("col-4");
  }
}

function headerWork() {
  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".header-menu");
  const backdrop = document.querySelector(".backdrop");
  const closeBtn = document.querySelector(".header-menu__close");

  headerSlides();
  headerWork();
  function headerSlides() {
    const subs = document.querySelectorAll(".header-sub");

    if (subs.length) {
      subs.forEach((sub) => {
        sub.addEventListener("click", () => {
          let spoiler = sub.querySelector(".header-sub__spoiler");

          spoiler.style.zIndex = "10";
          slideShow(spoiler);
          sub.classList.add("active");
        });
        sub.addEventListener("mouseleave", () => {
          let spoiler = sub.querySelector(".header-sub__spoiler");

          spoiler.style.zIndex = "";
          setTimeout(() => {
            slideHide(spoiler);
            sub.classList.remove("active");
          }, 300);
        });
      });
    }
  }
  function headerWork() {
    if (burger) {
      burger.addEventListener("click", () => {
        openBurger();
      });
      backdrop.addEventListener("click", () => {
        closeBurger();
      });
      closeBtn.addEventListener("click", () => {
        closeBurger();
      });
    }
  }
  function openBurger() {
    burger.classList.add("active");
    menu.classList.add("active");
    backdrop.classList.add("active");
    body.classList.add("lock");
  }
  function closeBurger() {
    burger.classList.remove("active");
    menu.classList.remove("active");
    backdrop.classList.remove("active");
    body.classList.remove("lock");
  }
}

function slideHide(el, duration = 100) {
  // завершаем работу метода, если элемент содержит класс collapsing или collapse_show
  if (
    el.classList.contains("collapsing") ||
    !el.classList.contains("collapse_show")
  ) {
    return;
  }
  // установим свойству height текущее значение высоты элемента
  el.style["height"] = `${el.offsetHeight}px`;
  // получим значение высоты
  el.offsetHeight;
  // установим CSS свойству height значение 0
  el.style["height"] = 0;
  // обрежем содержимое, выходящее за границы элемента
  el.style["overflow"] = "hidden";
  // добавим CSS свойство transition для осуществления перехода длительностью this._duration
  el.style["transition"] = `height ${duration}ms ease`;
  // удалим классы collapse и collapse_show
  el.classList.remove("collapse", "collapse_show");
  // el.classList.remove("collapse_show");
  // добавим класс collapsing
  el.classList.add("collapsing");
  // после завершения времени анимации
  window.setTimeout(() => {
    // удалим класс collapsing
    el.classList.remove("collapsing");
    // добавим класс collapsing
    el.classList.add("collapse");
    // удалим свойства height, transition и overflow
    el.style["height"] = "";
    el.style["transition"] = "";
    el.style["overflow"] = "";
  }, duration);
}

function slideShow(el, duration = 100) {
  // завершаем работу метода, если элемент содержит класс collapsing или collapse_show
  if (
    el.classList.contains("collapsing") ||
    el.classList.contains("collapse_show")
  ) {
    return;
  }
  // удаляем класс collapse
  el.classList.remove("collapse");
  // сохраняем текущую высоту элемента в константу height (это значение понадобится ниже)
  const height = el.offsetHeight;
  // устанавливаем высоте значение 0
  el.style["height"] = 0;
  el.style["overflow"] = "hidden";
  // не отображаем содержимое элемента, выходящее за его пределы
  // создание анимации скольжения с помощью CSS свойства transition
  el.style["transition"] = `height ${duration}ms ease`;
  // добавляем класс collapsing
  el.classList.add("collapsing");
  // получим значение высоты (нам этого необходимо для того, чтобы просто заставить браузер выполнить перерасчет макета, т.к. он не сможет нам вернуть правильное значение высоты, если не сделает это)
  el.offsetHeight;
  // установим в качестве значения высоты значение, которое мы сохранили в константу height
  el.style["height"] = `${height}px`;
  // по истечении времени анимации this._duration
  window.setTimeout(() => {
    // удалим класс collapsing
    el.classList.remove("collapsing");
    // добавим классы collapse и collapse_show
    el.classList.add("collapse", "collapse_show");
    // el.classList.add("collapse_show");
    // удалим свойства height, transition и overflow
    el.style["height"] = "";
    el.style["transition"] = "";
    el.style["overflow"] = "";
  }, duration);
}

function accordion(linkSelector, contentSelector) {
  // получаем линки
  const openLinks = document.querySelectorAll(`${linkSelector}`);
  // контенты
  const contents = document.querySelectorAll(`${contentSelector}`);
  if (openLinks.length > 0) {
    for (let i = 0; i < openLinks.length; i++) {
      let openLink = openLinks[i];
      openLink.addEventListener("click", () => {
        // все прячем
        for (let j = 0; j < contents.length; j++) {
          // если хоть один открывается - return
          if (contents[j].classList.contains("collapsing")) {
            return;
          } // Иначе
          // все прячем
          slideHide(contents[j]);
        }
        for (let j = 0; j < openLinks.length; j++) {
          openLinks[j].classList.remove("active");
        }
        // записываем в переменную нужный таб
        let content = openLink.nextElementSibling;
        // работаем с классами линка
        if (content.classList.contains("collapsing")) {
          return;
        } else if (content.classList.contains("collapse_show")) {
          openLink.classList.remove("active");
        } else {
          openLink.classList.add("active");
        }
        // показываем нужный
        slideShow(content);
      });
    }
  }
}
