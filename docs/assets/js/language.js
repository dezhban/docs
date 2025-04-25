(function () {
  var language = function (hook, vm) {
    const config = Object.assign(
      {},
      {
        languages: [
          {
            lang: "fa",
            dir: "rtl",
            url: "fa-IR",
          },
          {
            lang: "en",
            dir: "ltr",
            url: "en-US",
          },
        ],
      },
      vm.config.rtl
    );

    hook.afterEach(function () {
      const defaultLanguage = config.languages[0];
      const language =
        config.languages.find((item) =>
          window.location.hash.includes(item.url)
        ) || defaultLanguage;

      document.documentElement.dir = language.dir;
      document.documentElement.lang = language.lang;
    });
  };

  // Add plugin to docsify's plugin array
  $docsify = $docsify || {};
  $docsify.plugins = [].concat(language, $docsify.plugins || []);
})();
