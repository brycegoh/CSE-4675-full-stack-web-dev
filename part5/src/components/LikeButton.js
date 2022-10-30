const LikeButton = ({ onClick }) => {
  return (
    <button style={{ marginLeft: '10px' }} onClick={onClick} id="like-btn">
      like
    </button>
  )
}

export default LikeButton
