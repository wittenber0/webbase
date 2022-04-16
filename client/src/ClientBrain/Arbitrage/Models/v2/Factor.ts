import Book from "./Book";

export default class Factor {
    public DecimalOdds: number;
    public AmericanOdds: number;
    public Book: Book;
    
    public constructor(decimalOdds:number, americanOdds:number, book:Book){
        this.DecimalOdds = decimalOdds;
        this.AmericanOdds = americanOdds,
        this.Book = book;
    }
   
}
