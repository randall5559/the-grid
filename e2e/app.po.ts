import { browser, element, by } from 'protractor';

export class AgPoc1MongoFePage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('ag-root h1')).getText();
  }
}
