describe('Main browser functionality', ()=>{
    before(async () => {
        const emailField = await browser.$('input[type="email"]');
        const passwordField = await browser.$('input[type="password"]');
        const signInButton = await browser.$('button=Sign In');
    
        await emailField.setValue('testuser@gmail.com');
        await passwordField.setValue('testpassword');
        await signInButton.click();

        const sidebar = await browser.$('[data-testid="Sidebar"]');
        await sidebar.waitForExist({ timeout: 5000 }); 
        expect(await sidebar.isDisplayed()).toBe(true);
      });

      it("Toggle Sidebar", async()=>{
        const toggleSidebarButton = await browser.$('[data-testid="Toggle Sidebar"]');
        const sidebar = await browser.$('[data-testid="Sidebar"]');

        await toggleSidebarButton.click();
        browser.pause(500);
        expect (await sidebar.getAttribute('class')).toContain('w-0');

        //Reopen sidebar again
        await browser.performActions([
            {
              type: 'pointer',
              id: 'mouse',
              parameters: { pointerType: 'mouse' },
              actions: [
                { type: 'pointerMove', origin: 'viewport', x: 1, y: 500 }, // Move to the left edge
                { type: 'pause', duration: 500 }, // Pause to trigger hover effect
              ],
            },
          ]);
      });

      it("should open a webview when a URL is entered and searched", async () => {
        const searchInput = await $("[data-testid='Input URL'");
        const searchButton = await $("[data-testid='Search URL'");
    
        await searchInput.setValue("https://google.com");
        await searchButton.click();
        await browser.pause(1000);
    
        const webview = await $("webview"); 
        expect(await webview.isDisplayed()).toBe(true);
        expect(await webview.getAttribute("src")).toContain("https://www.google.com/");
      });
    
      it("should toggle Copilot when the button is clicked", async () => {
        const copilotButton = await $("[data-testid='Copilot']");
    
        await copilotButton.click();
        await browser.pause(500);
    
        const copilotPane = await $("div[data-testid='Copilot Div']"); 
        expect(await copilotPane.isDisplayed()).toBe(true);

        await copilotButton.click();
        await browser.pause(500);
        expect(await copilotPane.isDisplayed()).toBe(false);
      });
    
      it("should open a new tab when the New Tab button is clicked", async () => {
        const newTabButton = await $("[data-testid='Open New Tab']");
        const tabs = await $$("[data-testid='Tabs']"); 
    
        const initialTabCount = tabs.length;
    
        await newTabButton.click();
        await browser.pause(500);
    
        const updatedTabs = await $$("div[data-testid='Tabs']");
        expect(updatedTabs.length).toEqual(initialTabCount + 1);
      });
});