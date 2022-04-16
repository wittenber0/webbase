export default class Book {
    public BookId: number;
    public BookName: string;
    public BookLogo: string;

    public constructor(bookId, bookName, bookLogo){
        this.BookId = bookId;
        this.BookName = bookName;
        this.BookLogo = bookLogo;
    }
}