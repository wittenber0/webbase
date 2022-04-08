export default class Odd {
  constructor(book, type, mlHome, mlAway, mlDraw, spreadHome, spreadAway, totalOver, totalUnder, lineSpread, lineOverUnder, homeOver, homeUnder, homeLine, awayOver, awayUnder, awayLine){
    this.book = book;
    this.type = type; //game, first half, second half etc.
    this.mlHome = mlHome;
	  this.mlAway = mlAway;
	  this.mlDraw = mlDraw;
    this.spreadHome = spreadHome;
	  this.spreadAway = spreadAway;
    this.totalOver = totalOver;
		this.totalUnder = totalUnder;
    this.lineSpread = lineSpread; //based on home
    this.lineOverUnder = lineOverUnder;
    this.homeOver = homeOver;
    this.homeUnder = homeUnder;
    this.homeLine = homeLine;
    this.awayOver = awayOver;
    this.awayUnder = awayUnder
    this.awayLine = awayLine;
  }
}
