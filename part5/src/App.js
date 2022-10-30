import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from 'react'
import Blog from './components/Blog'
import CreateBlogSection from './components/CreateBlogSection'
import blogService from './services/blogs'
import authService from './services/auth'
import './app.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    refreshBlogs()
    const userJson = window.localStorage.getItem('user')
    if (userJson !== null) {
      setUser(JSON.parse(userJson))
    }
  }, [])

  const refreshBlogs = () => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }

  const notifyUser = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }

  return (
    <div>
      {message !== null && <Notification message={message} />}
      {user !== null ? (
        <>
          <BlogSection
            blogs={blogs}
            user={user}
            setUser={setUser}
            refreshBlogs={refreshBlogs}
            notifyUser={notifyUser}
          />
        </>
      ) : (
        <LoginForm setUser={setUser} notifyUser={notifyUser} />
      )}
    </div>
  )
}
const Notification = ({ message }) => {
  return (
    <div className={message.type === 'success' ? 'success' : 'error'}>
      {message.message}
    </div>
  )
}
// eslint-disable-next-line react/display-name
const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return { toggleVisibility }
  })
  return (
    <div>
      <div style={hideWhenVisible}>
        <button id="new-blog-btn" onClick={toggleVisibility}>
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

const BlogSection = ({ blogs, user, setUser, refreshBlogs, notifyUser }) => {
  const createBlogRef = useRef()

  let toggleToggleable = () => {
    createBlogRef.current.toggleVisibility()
  }

  return (
    <>
      <h2>blogs</h2>
      <div>
        {`${user.name} logged in`}
        <button
          onClick={() => {
            window.localStorage.removeItem('user')
            setUser(null)
          }}
        >
          Log out
        </button>
      </div>

      <Togglable buttonLabel="new blog" ref={createBlogRef}>
        <CreateBlogSection
          handlePostBlog={async (newBlogEntry) => {
            await blogService.createBlog(
              newBlogEntry.title,
              newBlogEntry.author,
              newBlogEntry.url
            )
            await refreshBlogs()
            toggleToggleable()
            notifyUser({
              type: 'success',
              message: `a new blog ${newBlogEntry.title} by ${newBlogEntry.author} added`,
            })
          }}
        />
      </Togglable>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
          alignItems: 'start',
        }}
      >
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} refreshBlog={refreshBlogs} />
        ))}
      </div>
    </>
  )
}

const LoginForm = ({ setUser, notifyUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    authService
      .login(username, password)
      .then((response) => {
        window.localStorage.setItem(
          'user',
          JSON.stringify({
            ...response.data,
          })
        )
        setUser({
          username: response.data.username,
          name: response.data.name,
        })
        setUsername('')
        setPassword('')
      })
      .catch((e) => {
        notifyUser({
          type: 'error',
          message: e.response.data.error,
        })
      })
  }

  return (
    <div>
      <h1>log in to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="submit" type="submit">
          login
        </button>
      </form>
    </div>
  )
}

export default App
