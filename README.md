
## Notes:

#### Data Models
* User
  * Email Address
    * Synonymous with Username - one in the same

#### Testing:
* Unable to test getOAuthAccessTokens.
  * Tried to use pupetteer to automate click on authorize button - twitter throw error saying javasript is disabled, even it using page.setJavaScriptEnabled(true) - moving forward we will use a test environment (.env.test.example and .env.test) to house a username and password - we will use the username and password to authenticate against already existing users in the mongo db (not moked or pre inserted) , if found we will continue and if not we won't (these users must have pre-existing authorized twitter oauth access tokens)

#### Development
// TODO: harden twitter oauth - always encrypt decrypt tokens inside service and continue to sign and unsign in controller - continue this pattern as this will only strengthen our security