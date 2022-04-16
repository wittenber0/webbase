export default class Book {
    public BookId: number;
    public BookName: string;
    public BookLogo: string;

    public constructor(bookId:number, bookName:string, bookLogo:string){
        this.BookId = bookId;
        this.BookName = bookName;
        this.BookLogo = bookLogo;
    }
}