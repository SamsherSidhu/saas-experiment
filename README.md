# <YOUR_APP_NAME>

This project is based on [OpenSaas](https://opensaas.sh) template and consists of three main dirs:
1. `app` - Your web app, built with [Wasp](https://wasp-lang.dev).
2. `e2e-tests` - [Playwright](https://playwright.dev/) tests for your Wasp web app.
3. `blog` - Your blog / docs, built with [Astro](https://docs.astro.build) based on [Starlight](https://starlight.astro.build/) template.

For more details, check READMEs of each respective directory!



how I did this:
1. curl -sSL https://get.wasp-lang.dev/installer.sh | sh
    **my .local/bin was not in my path, so I had to add it there**
    for Mac users:
        I'll help you add that directory to your PATH. Since you're on a Mac (I can tell from the path), you'll need to edit your shell's configuration file.
        First, let's determine which shell you're using. You can check by opening Terminal and running:
        bashCopyecho $SHELL
        Based on the output:

        If it shows /bin/zsh (most likely, as this is default on newer Macs):

        bashCopyecho 'export PATH=$PATH:/Users/samshersidhu/.local/bin' >> ~/.zshrc

        If it shows /bin/bash:

        bashCopyecho 'export PATH=$PATH:/Users/samshersidhu/.local/bin' >> ~/.bash_profile
        After running the appropriate command, either:

        Close and reopen your terminal
        Or run source ~/.zshrc (for zsh) or source ~/.bash_profile (for bash)

        You can verify it worked by running:
        bashCopyecho $PATH
        You should see /Users/samshersidhu/.local/bin in the output.
2. wasp new -t saas
3. Followed this:
    1. Position into app's root directory:
    cd saas-experiment/app

  2. Run the development database (and leave it running):
    wasp db start

  3. Open new terminal window (or tab) in that same dir and continue in it.

  4. Apply initial database migrations:
    wasp db migrate-dev

  5. Create initial dot env file from the template:
    cp .env.server.example .env.server

  6. Last step: run the app!
    wasp start