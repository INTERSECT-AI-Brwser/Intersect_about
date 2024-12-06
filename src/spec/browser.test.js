import {browser, expect, $} from '@wdio/globals'

describe('Intersect Browser', () => {
  it('should load the app and verify the title', async () => {
    const title = await browser.getTitle();
    expect(title).toEqual("Intersect");
  });
  
});
