const API_URL = 'http://localhost:3003/api'
const APP_URL = 'http://localhost:3000'

const USERNAME = 'TESTING'
const PASSWORD = 'TESTING'
const NAME = 'TEST USER'

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${API_URL}/testing/reset`)
    const user = {
      name: NAME,
      username: USERNAME,
      password: PASSWORD,
    }
    cy.request('POST', `${APP_URL}/api/users/`, user)
    cy.visit(`${APP_URL}`)
  })

  it('Login form is shown', function () {
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type(USERNAME)
      cy.get('#password').type(PASSWORD)
      cy.get('#submit').click()
      cy.contains('blogs')
      cy.contains(`${NAME} logged in`)
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type(USERNAME)
      cy.get('#password').type(PASSWORD + 'asd')
      cy.get('#submit').click()
      cy.contains('invalid username or password')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.request('POST', `${API_URL}/login`, {
        username: USERNAME,
        password: PASSWORD,
      }).then((response) => {
        localStorage.setItem('user', JSON.stringify(response.body))
        cy.visit(APP_URL)
      })
    })

    it('A blog can be created', function () {
      const TITLE = 'test title'
      const AUTHOR = 'test author'
      const URL = 'test url'
      cy.contains('new blog').click()
      cy.get('#title-input').type(TITLE)
      cy.get('#author-input').type(AUTHOR)
      cy.get('#url-input').type(URL)
      cy.get('#create-blog-btn').click()
      cy.contains(TITLE)
      cy.contains(AUTHOR)
    })

    it('A blog can be liked', function () {
      const TITLE = 'test title'
      const AUTHOR = 'test author'
      const URL = 'test url'
      cy.contains('new blog').click()
      cy.get('#title-input').type(TITLE)
      cy.get('#author-input').type(AUTHOR)
      cy.get('#url-input').type(URL)
      cy.get('#create-blog-btn').click()
      cy.contains(TITLE)
      cy.contains(AUTHOR)

      cy.get('#toggle-view-btn').click()
      cy.contains('0 likes')
      cy.contains('like').click()
      cy.contains('1 likes')
    })

    it('A blog can be deleted', function () {
      const TITLE = 'test title'
      const AUTHOR = 'test author'
      const URL = 'test url'
      cy.contains('new blog').click()
      cy.get('#title-input').type(TITLE)
      cy.get('#author-input').type(AUTHOR)
      cy.get('#url-input').type(URL)
      cy.get('#create-blog-btn').click()
      cy.contains(TITLE)
      cy.contains(AUTHOR)
      cy.get('#toggle-view-btn').click()
      cy.contains('Delete').click()
      cy.contains(TITLE).should('not.exist')
      cy.contains(AUTHOR).should('not.exist')
      cy.contains(URL).should('not.exist')
    })

    it.only('Most liked blog is on the top', function () {
      cy.intercept('GET', '**/blogs').as('blogApi')
      const MOST_LIKED_TITLE = 'most like test title'
      const MOST_LIKED_AUTHOR = 'most like test author'
      const MOST_LIKED_URL = 'most like test url'

      const LEAST_LIKED_TITLE = 'least like test title'
      const LEAST_LIKED_AUTHOR = 'least like test author'
      const LEAST_LIKED_URL = 'least like test url'

      cy.get('#new-blog-btn').click()
      cy.get('#title-input').type(MOST_LIKED_TITLE)
      cy.get('#author-input').type(MOST_LIKED_AUTHOR)
      cy.get('#url-input').type(MOST_LIKED_URL)
      cy.get('#create-blog-btn').click()
      cy.wait('@blogApi')

      cy.get('#toggle-view-btn').click()
      cy.contains('0 likes')
      cy.get('#like-btn').click()
      cy.contains('1 likes')

      cy.get('#new-blog-btn').click()
      cy.get('#title-input').type(LEAST_LIKED_TITLE)
      cy.get('#author-input').type(LEAST_LIKED_AUTHOR)
      cy.get('#url-input').type(LEAST_LIKED_URL)
      cy.get('#create-blog-btn').click()

      // cy.wait('@blogApi')
      cy.wait(1000)

      cy.get('.blog').eq(0).should('contain', MOST_LIKED_TITLE)
      cy.get('.blog').eq(1).should('contain', LEAST_LIKED_TITLE)
    })
  })
})
