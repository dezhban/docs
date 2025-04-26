(function () {
  var language = function (hook, vm) {
    const config = Object.assign(
      {},
      {
        languages: [],
      },
      vm.config.i18n
    );

    function getLanguage() {
      const defaultLanguage = config.languages[0];
      const language =
        config.languages.find((item) =>
          window.location.hash.includes(item.url)
        ) || defaultLanguage;
      return language;
    }

    hook.doneEach(function () {
      const language = getLanguage();
      if (!language) {
        return;
      }

      document.documentElement.dir = language.dir;
      document.documentElement.lang = language.lang;

      if (language.title) {
        const seprator = language.title.seprator || "|";
        let newTitle = "";

        if (typeof language.title.prefix === "string") {
          newTitle =
            language.title.prefix + " " + seprator + " " + document.title;
        }

        if (typeof language.title.suffix === "string") {
          newTitle = newTitle + " " + language.title.suffix;
        }

        document.title = newTitle;
      }
    });
  };

  // Add plugin to docsify's plugin array
  $docsify = $docsify || {};
  $docsify.plugins = [].concat(language, $docsify.plugins || []);
})();
