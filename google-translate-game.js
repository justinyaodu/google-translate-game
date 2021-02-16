(function () {
  // Approximate delay between each call to update().
  const UPDATE_DELAY_MS = 100;

  // Selector for the dropdown menu which chooses the target language.
  // This element contains the menu options for each language.
  const TARGET_LANGUAGE_PICKER_SELECTOR = "c-wiz.bvzp8c.DlHcnf div.ykTHSe div.rT1Yue:not(.O7tFcd)";

  // Selector for the top bar with the "Text" and "Documents" buttons.
  const BUTTON_BAR_SELECTOR = "nav.U0xwnf";

  // Styles to apply to hide the language names.
  const HIDE_LANGUAGE_STYLES = ".ordo2 * { visibility: hidden; } .X4DQ0.zWsGpc { visibility: hidden; }";

  /**
   * Output a log message.
   */
  function log(message) {
    console.log("Google Translate Game: " + message);
  }

  /**
   * Shuffle the children of an element.
   */
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

  // Element containing the toggleable style sheet for hiding language names.
  const hideLanguagesStyleSheet = (function() {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = HIDE_LANGUAGE_STYLES;
    document.head.appendChild(styleSheet);
    return styleSheet;
  })();

  /**
   * Set whether the language names should be hidden.
   */
  function setHidden(hidden) {
    hideLanguagesStyleSheet.disabled = !hidden;
    log(`languages hidden: ${hidden}`);
  }
  setHidden(false);

  // Checkbox for hiding language names and randomizing the menu.
  const checkbox = (function () {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
      setHidden(checkbox.checked);
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

  // Whether the menu was visible on the last update() call.
  let menuVisiblePrev = false;

  function update() {
    if (checkbox.checked) {
      const menu = document.querySelector(TARGET_LANGUAGE_PICKER_SELECTOR);
      if (menu !== null && !menuVisiblePrev) {
        shuffleChildren(menu);
        log("language menu randomized");
      }
      menuVisiblePrev = (menu !== null);
    }

    setTimeout(update, UPDATE_DELAY_MS);
  }

  update();
})();
