import BlogsCard from '../components/BlogsCard'
import AppBar from '../components/AppBar'
import { useBlogs } from '../hooks'
import BlogSkelenton from '../components/BlogSkelenton';

const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) {
        return <div>
            <AppBar /> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkelenton />
                    <BlogSkelenton />
                    <BlogSkelenton />
                    <BlogSkelenton />
                    <BlogSkelenton />
                </div>
            </div>
        </div>
    }

    return <div>
        <AppBar />
        <div  className="flex justify-center">
            <div>
                
            {blogs.map(blog => <BlogsCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishDate={"2nd Feb 2024"}
                />)}
            </div>
        </div>
    </div>
}


export default Blogs;