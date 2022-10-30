import { useState } from 'react'

const CreateBlogSection = ({ handlePostBlog }) => {
  const [newBlogEntry, setBlogEntry] = useState({
    title: '',
    author: '',
    url: '',
  })
  return (
    <div>
      <h1>create new</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handlePostBlog(newBlogEntry)
          setBlogEntry({
            title: '',
            author: '',
            url: '',
          })
        }}
      >
        <div>
          Title
          <input
            id="title-input"
            type="text"
            value={newBlogEntry['title']}
            name="Title"
            onChange={({ target }) =>
              setBlogEntry({ ...newBlogEntry, title: target.value })
            }
          />
        </div>
        <div>
          Author
          <input
            id="author-input"
            type="text"
            value={newBlogEntry['author']}
            name="Author"
            onChange={({ target }) =>
              setBlogEntry({ ...newBlogEntry, author: target.value })
            }
          />
        </div>
        <div>
          URL
          <input
            id="url-input"
            type="text"
            value={newBlogEntry['url']}
            name="URL"
            onChange={({ target }) =>
              setBlogEntry({ ...newBlogEntry, url: target.value })
            }
          />
        </div>
        <button type="submit" id="create-blog-btn">
          create
        </button>
      </form>
    </div>
  )
}

export default CreateBlogSection
