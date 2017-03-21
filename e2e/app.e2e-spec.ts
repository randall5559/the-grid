import { AgPoc1MongoFePage } from './app.po';

describe('agency-gateway App', function() {
  let page: AgPoc1MongoFePage;

  beforeEach(() => {
    page = new AgPoc1MongoFePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('ag works!');
  });
});
