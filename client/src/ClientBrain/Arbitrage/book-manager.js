import ArbitrageService from '../../Shared/arbitrage-service';
import Book from './Models/book';

const defaultSelectedBookIds = [1003, 8, 21, 1001];

class BookManager {
  isLoaded;
  allBooks;
  selectedBooks;
  selectedBookIds;

  constructor(){
    this.allBooks = [];
    this.selectedBooks = [];
    this.isLoaded = false;
    this.selectedBookIds = defaultSelectedBookIds;
  }

  getSelectedBookIds(){
    return this.selectedBookIds;
  }

  async loadBooks(){
    return await ArbitrageService.getAllBooks().then((r)=>{
      this.getMyLiveBooks().forEach( book => {
        this.allBooks.push(book);
      })
			r["books"].forEach( book => {
        let bookName = book['display_name'];
    		let bookLogo = (book['meta']['logos'] ? book['meta']['logos']['primary'] : null);
        this.allBooks.push(new Book(book['id'], bookName, bookLogo));
      });
			this.selectedBooks = this.allBooks.filter((b)=> {return this.selectedBookIds.includes(b.bookId)});
      this.isLoaded = true;
		});
  }

  getSelectedBooks(){
    return this.selectedBooks;
  };

  getBookById(id){
    return this.allBooks.find( b => b.bookId === id);
  }

  getMyLiveBooks(){
    let liveBooks = [
      new Book(1003, 'Pinnacle (Live)', null),
      new Book(1001, 'BetOnline (Live)', null)
    ]
    return liveBooks;
  }
}

var BookManagerWrapper = (function () {
    var instance;

    function createInstance() {
        var object = new BookManager();
        return object;
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

export default BookManagerWrapper;
