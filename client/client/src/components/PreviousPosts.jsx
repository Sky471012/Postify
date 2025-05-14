import { useState, useEffect } from 'react';
import reactions from "../assets/images/reactions.png";

export default function PreviousPosts(props) {
    const [search, setSearch] = useState('');

    const userName = props.name;
    const userPicture = props.picture;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedPosts, setExpandedPosts] = useState({});

    useEffect(() => {
      if (!userName) return;

      fetch(`http://localhost:5000/api/users/exists?name=${encodeURIComponent(userName)}`)
        .then((res) => {
          if (!res.ok) throw new Error('User not found');
          return res.json();
        })
        .then((data) => {
          setUser(data.user || null);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Fetch error:', err);
          setUser(null);
          setLoading(false);
        });
    }, [userName]);

    if (loading) return <p>Loading user data...</p>;
    if (!user) return <p>User not found.</p>;

    const toggleExpand = (index) => {
      setExpandedPosts((prev) => ({
        ...prev,
        [index]: !prev[index],
      }));
    };

  return (<>

    <div className="search-bar">
      <i className="bi bi-search"></i>
      <input type="search" placeholder="Search your post..." aria-label="Search" value={search} onChange={(e)=>{setSearch(e.target.value)}}/>
    </div>

    <h1 className='mt-5 m-3 pt-5'>Your Previous Posts</h1>

    <div className="row justify-content-center">
      {user.post && user.post.length > 0 ? (
        user.post
        .filter((post) => 
          typeof post?.content === 'string' && 
          post.content.toLowerCase().includes(search.toLowerCase())
        )
        .map((post, index) => {
          const isExpanded = expandedPosts[index];
          const preview = post.content.length > 142
            ? post.content.slice(0, 142) + '...'
            : post.content;
          return (

            <div className="col-lg-6 col-md-7 col-sm-8 " key={index}>
              <div className="single-post mt-4">
                <div className="date">
                  <span style={{ fontWeight: "normal", color: "white" }}>Posted on:</span>
                  {post.date && (
                    <h5 className="post-title" style={{ fontWeight: "normal" }}>
                      {new Date(post.date).toLocaleString()}
                    </h5>
                  )}
                  <div className="line"></div>
                </div>

                <div className="post">
                  <div className="profile">
                    <img className='profile-preview-img' src={userPicture} alt="img" />
                    <div className="name">
                      <span style={{ fontSize: "1rem", fontWeight: "bold" }}>{userName}</span>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <span>Now</span>
                        <div className="dot"></div>
                        <i className="bi bi-globe-central-south-asia"></i>
                      </div>
                    </div>
                  </div>

                  <div className="content">
                    <div className="text-preview" id="postPreview">
                      {isExpanded ? post.content : preview}
                      {post.content.length > 142 && (
                        <span
                          onClick={() => toggleExpand(index)}
                          style={{ color: "#0073b1", cursor: "pointer", marginLeft: "5px" }}
                        >
                          {isExpanded ? " read less" : " read more"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="reaction">
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px" }}>
                      <img src={reactions} alt="sky" className="reactions" />
                      <span>Aakash Sharma and 79 others</span>
                    </div>
                    <div className="comments">
                      <span>20 comments</span>
                      <div className="dot"></div>
                      <span>3 reposts</span>
                    </div>
                  </div>

                  <div className="horizontal-line"></div>

                  <div className="react">
                    <div className="react-type">
                      <i className="bi bi-hand-thumbs-up flip-horizontal"></i>
                      <span>Like</span>
                    </div>
                    <div className="react-type">
                      <i className="bi bi-chat"></i>
                      <span>Comment</span>
                    </div>
                    <div className="react-type">
                      <i className="bi bi-chat"></i>
                      <span>Share</span>
                    </div>
                    <div className="react-type">
                      <i className="bi bi-send"></i>
                      <span>Send</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
})
      ) : (
        <p>No posts found.</p>
      )}
    </div>


  </>)
}
