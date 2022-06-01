import ArbitrageService from '../../Shared/arbitrage-service';
import Book from './Models/v2/Book';
import App from '../../App';

const defaultSelectedBookIds = [1003, 8, 21, 1001];
const bovadaLogo = 'https://www.aplussportsandmore-fanshop-baseballfield.com/images/bovada-logo_0.png'
const myBookieLogo = 'https://images.squarespace-cdn.com/content/v1/5ab4527b3c3a536a7a352c05/1631109644782-2TR7KXFGKPA84ZHFCI94/TRANSPARENT-MB.png'

class BookManager {
  private static instance?: BookManager
  isLoaded: Boolean;
  allBooks: Book[];
  selectedBooks: Book[];
  selectedBookIds: number[];

  private constructor(){
    this.allBooks = [];
    this.selectedBooks = [];
    this.isLoaded = false;
    if(App.user().user_metadata.arbitrage && App.user().user_metadata.arbitrage.myBooks){
      this.selectedBookIds = App.user().user_metadata.arbitrage.myBooks;
    } else {
      this.selectedBookIds = defaultSelectedBookIds;
    }
  }

  private static createInstance() {
    let object = new BookManager();
    return object;
  }

  public static getInstance() {
    if (!this.instance) {
        this.instance = this.createInstance();
    }
    return this.instance;
}

  getSelectedBookIds(){
    return this.selectedBookIds;
  }

  async loadBooks(){
    this.allBooks = [];
    return await ArbitrageService.getAllBooks().then((r)=>{
      this.getMyLiveBooks().forEach( book => {
        this.allBooks.push(book);
      })
			r["books"].forEach( (book:any) => {
        let bookName = book['display_name'];
    		let bookLogo = (book['meta']['logos'] ? book['meta']['logos']['primary'] : null);
        if(book['id'] === 21){
          bookLogo = bovadaLogo;
        }
        if(book['id'] === 8){
          bookLogo = myBookieLogo;
        }
        this.allBooks.push(new Book(book['id'], bookName, bookLogo));
      });
			this.selectedBooks = this.allBooks.filter((b)=> {return this.selectedBookIds.includes(b.BookId)});
      this.isLoaded = true;
		});
  }

  getSelectedBooks(){
    return this.selectedBooks;
  };

  getBookById(id: number){
    let b = this.allBooks.find( b => b.BookId === id)
    if(b){
      return b;
    }else{
      return new Book(0, 'Unknown Book')
    }
  }

  getMyLiveBooks(){
    let liveBooks = [
      new Book(1003, 'Pinnacle (Live)', 'https://www.pinnacle.com/static/media/logo-on-dark.94bbcdf8.svg'),
      new Book(1001, 'BetOnline (Live)', 'https://www.predictem.com/wp-content/uploads/2018/05/BetOnline-logo.png')
    ]
    return liveBooks;
  }

  updateBookById(bookId: number){
    if(this.selectedBookIds.includes(bookId)){
      this.selectedBookIds = this.selectedBookIds.filter(b => b !== bookId);
    }else {
      this.selectedBookIds.push(bookId);
    }
    this.selectedBooks = this.allBooks.filter((b)=> {return this.selectedBookIds.includes(b.BookId)});
    App.cacheMyBooks(this.selectedBookIds);
  }
}

export default BookManager;