import Book from "./Book";

export default class Factor {
    DecimalOdds: number;
    AmericanOdds: number;
    Book: Book;
    Best: boolean;
    EV?: number;
    
    constructor(decimalOdds:number, americanOdds:number, book:Book){
        this.DecimalOdds = decimalOdds;
        this.AmericanOdds = americanOdds;
        this.Book = book;
        this.Best = false;
    }
   
}
