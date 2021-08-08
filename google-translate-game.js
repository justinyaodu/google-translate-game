(function () {
  // Selector for the language buttons in the language selection dropdown menus.
  const DROPDOWN_BUTTON_SELECTOR = "div[data-language-code][tabindex='0']";

  // Selector for the tabs that show the initial and translated language names.
  const TAB_SELECTOR = "[role=tab]";

  // Selector for the top bar with the "Text" and "Documents" buttons.
  const BUTTON_BAR_SELECTOR = "nav[aria-labelledby]:not([jsname])";

  // Styles to apply to hide the language names.
  const HIDE_LANGUAGE_STYLES = `
    ${TAB_SELECTOR} * {
      visibility: hidden;
    }

    ${DROPDOWN_BUTTON_SELECTOR} * {
      visibility: hidden;
    }

    ${DROPDOWN_BUTTON_SELECTOR} {
      border: 1px solid black;
    }
  `;

  // Millisecond interval for polling the visibility of the language menu.
  const POLL_INTERVAL = 100;

  function isLanguageMenuVisible() {
    return document.querySelector("body > c-wiz").classList.length > 5;
  }

  function log(message) {
    console.log("Google Translate Game: " + message);
  }

  function shuffleChildren(element) {
    const children = Array.from(element.children);

    for (let i = children.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      const temp = children[i];
      children[i] = children[j];
      children[j] = temp;
    }

    element.replaceChildren(...children);
  }

  function shuffleMenus() {
    log("shuffling menus");
    const menus = new Set();
    for (const button of document.querySelectorAll(DROPDOWN_BUTTON_SELECTOR)) {
      menus.add(button.parentElement);
    }
    for (const menu of menus) {
      shuffleChildren(menu);
    }
  }

  // Element containing the toggleable style sheet for hiding language names.
  const hideLanguagesStyleSheet = (function() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = HIDE_LANGUAGE_STYLES;
    document.head.appendChild(styleSheet);
    return styleSheet;
  })();

  function setLanguagesHidden(hidden) {
    hideLanguagesStyleSheet.disabled = !hidden;
    log(`languages hidden: ${hidden}`);
  }
  setLanguagesHidden(false);

  // Checkbox for hiding language names and randomizing the menu.
  const checkbox = (function () {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
      setLanguagesHidden(checkbox.checked);
    });
    return checkbox;
  })();

  // Label the checkbox.
  const checkboxParent = (function() {
    const label = document.createElement("label");
    label.replaceChildren(
      document.createTextNode("Hide and randomize languages:"),
      checkbox,
    );
    return label;
  })();

  // Add the checkbox to the button bar.
  const buttonBar = document.querySelector(BUTTON_BAR_SELECTOR);
  buttonBar.appendChild(checkboxParent);

  // If the checkbox is checked, shuffle the menu each time the menu is opened.
  let menuVisiblePrev = false;
  function update() {
    const menuVisible = isLanguageMenuVisible();
    if (menuVisible === menuVisiblePrev) {
      return;
    }

    log("menu visible: " + menuVisible);

    menuVisiblePrev = menuVisible;
    if (menuVisible && checkbox.checked) {
      shuffleMenus();
    }
  }
  setInterval(update, POLL_INTERVAL);
})();
