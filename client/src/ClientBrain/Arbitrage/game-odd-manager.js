
class gmo {
  constructor(){
    this.selectedBooks = [];
    this.gameOdds = [];
    this.games = [];
  }
}

var GameOddManager = (function () {
    var instance;

    function createInstance() {
        var object = new gmo();
        return object;
    }

    function getBetOnlineGames(){

    }

    function getBovadaGames(){

    }

    function getMyBookieGames(){

    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

export default GameOddManager;
