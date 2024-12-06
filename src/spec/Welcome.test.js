describe('Welcome Page - Sign In/Sign Up', ()=>{
    it('should display the Welcome page with sign-in and sign-up options', async () => {
        const signInButton = await browser.$('button=Sign In');
        expect(await signInButton.isDisplayed()).toBe(true);

        const signUpLink = await browser.$('button=Don\'t have an account? Sign Up');
        expect(await signUpLink.isDisplayed()).toBe(true);
      });

      it('should toggle to Sign Up form when "Don\'t have an account? Sign Up" link is clicked', async () => {
        const signUpLink = await browser.$('button=Don\'t have an account? Sign Up');
        await signUpLink.click();

        const firstNameField = await browser.$('input[placeholder="First Name"]');
        const lastNameField = await browser.$('input[placeholder="Last Name"]');
        expect(await firstNameField.isDisplayed()).toBe(true);
        expect(await lastNameField.isDisplayed()).toBe(true);
    
        const signUpButton = await browser.$('button=Sign Up');
        expect(await signUpButton.isDisplayed()).toBe(true);

        //Revert Back to Sign In
        await signUpLink.click();
      });

      it('should display the error message since user doesn\'t exist', async()=>{
        const emailField = await browser.$('input[type="email"]');
        const passwordField = await browser.$('input[type="password"]');
        const signInButton = await browser.$('button=Sign In');
    
        await emailField.setValue('wronguser@gmail.com');
        await passwordField.setValue('wrongpassword');
        await signInButton.click();

        await browser.pause(1000);

        const errorMessage = await browser.$('p=INVALID-CREDENTIAL');
        expect(await errorMessage.isDisplayed()).toBe(true);
      });

      it('should sign in successfully with valid credentials', async () => {
        const emailField = await browser.$('input[type="email"]');
        const passwordField = await browser.$('input[type="password"]');
        const signInButton = await browser.$('button=Sign In');
    
        await emailField.setValue('testuser@gmail.com');
        await passwordField.setValue('testpassword');
        await signInButton.click();
        
        await browser.pause(3000);

        const sidebar = await browser.$('[data-testid="Sidebar"]');
        expect(await sidebar.isDisplayed()).toBe(true);
      });
})