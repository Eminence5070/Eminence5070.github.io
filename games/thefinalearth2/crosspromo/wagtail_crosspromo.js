(function() {
    var baseURI = "https://florianvanstrien.nl/crosspromo/";

    var mainPartHTML = null, gamePartHTML = null;
    var promoteTheseGames = null;
    var gameTitle = "";
    var currentGameConfiguration = "";
    var crossPromoIsOpen = false;
    var crossPromoOnClose = undefined;

    function loadCSS(cssUrl, thenDo) {
        var linkElem = document.createElement("link");
  
        linkElem.rel = "stylesheet";
        linkElem.type = "text/css";
        linkElem.href = cssUrl;
        linkElem.addEventListener("load", function() {
            thenDo();
        });
        
        document.getElementsByTagName("HEAD")[0].appendChild(linkElem);
    }

    function loadJS(filename, thenDo) {
        var scriptelem = document.createElement('script');
        scriptelem.setAttribute("src", filename);
        document.getElementsByTagName('head')[0].appendChild(scriptelem);
        scriptelem.onload = thenDo;
    }

    function resourcesLoaded() {
        return mainPartHTML !== null && gamePartHTML !== null && promoteTheseGames !== null;
    }
    
    //Load everything
    loadCSS(baseURI + "crosspromo_style.css", function() {
        loadJS(baseURI + "crosspromo_polyfills.js", function() {
            fetch(baseURI + "crosspromo_basics.htmlpart").then(function(response) {
                return response.text();
            }).then(function(text) {
                mainPartHTML = text;
                if (resourcesLoaded() && window.crossPromoOnLoaded)
                    window.crossPromoOnLoaded();
            });

            fetch(baseURI + "crosspromo_game.htmlpart").then(function(response) {
                return response.text();
            }).then(function(text) {
                gamePartHTML = text;
                if (resourcesLoaded() && window.crossPromoOnLoaded)
                    window.crossPromoOnLoaded();
            });

            fetch(baseURI + "crosspromo_games.json").then(function(response) {
                return response.json(); 
            }).then(function(json) {
                promoteTheseGames = json;
                if (resourcesLoaded() && window.crossPromoOnLoaded)
                    window.crossPromoOnLoaded();
            });
        });
    });

    function buildCrossPromo() {
        if (resourcesLoaded() && !crossPromoIsOpen) {
            var theMainPanel = document.createElement("DIV");
            theMainPanel.id = "crossPromoMainPanel";
            document.body.appendChild(theMainPanel);
            var gamesHTML = "";
            for (var i = 0; i < promoteTheseGames.length; i++) {
                var thisGame = promoteTheseGames[i];

                if (thisGame.name != gameTitle && !thisGame.excludeConfigs.indexOf(currentGameConfiguration) >= 0) {
                    var thisGameHTML = gamePartHTML;
                    thisGameHTML = thisGameHTML.replace("#GAME_TITLE#", thisGame.name);
                    thisGameHTML = thisGameHTML.replace("#GAME_DESCRIPTION#", thisGame.description);
                    thisGameHTML = thisGameHTML.replace("#BACKGROUND#", thisGame.image);
                    var gameLink = thisGame.links[currentGameConfiguration];
                    if (gameLink === undefined)
                        gameLink = thisGame.links["kongregate"];
                    if (gameLink === undefined)
                        gameLink = thisGame.links["common"];
                    thisGameHTML = thisGameHTML.replace("#GAME_URL#", gameLink);
                    gamesHTML += thisGameHTML;
                }
            }

            var finalHTML = mainPartHTML;
            finalHTML = finalHTML.replace("#GAMES#", gamesHTML);
            finalHTML = finalHTML.replace("#THIS_GAME_TITLE#", gameTitle);

            theMainPanel.innerHTML = finalHTML;

            document.getElementById("crossPromoCloseButton").addEventListener("click", function() {
                closeCrossPromo();
            });

            crossPromoIsOpen = true;
        }
    }

    window.crossPromoIsReady = function() {
        return resourcesLoaded();
    }

    window.crossPromoConfig = function(title, configuration) {
        gameTitle = title;
        currentGameConfiguration = configuration;
    }

    window.crossPromoOpen = function(onClose) {
        buildCrossPromo();
        crossPromoOnClose = onClose;
    }

    window.closeCrossPromo = function() {
        if (crossPromoIsOpen) {
            crossPromoIsOpen = false;
            this.document.body.removeChild(document.getElementById("crossPromoMainPanel"));
            if (crossPromoOnClose != undefined)
                crossPromoOnClose();
        }
    }

    window.crossPromoVisible = function() {
        return crossPromoIsOpen;
    }

    window.crossPromoOnLoaded = undefined;
})();