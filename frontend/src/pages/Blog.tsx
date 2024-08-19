import AppBar from '../components/AppBar';
import FullBlog from '../components/FullBlog';
import { Spinner } from '../components/Spinner';
import { useParams } from 'react-router-dom';
import { useBlog } from '../hooks';

const Blog = () => {
  const {id} = useParams();
  const {loading, blog} = useBlog({
    id: id || ""
  });

  if(loading || !blog){
    return <div>
      <AppBar/>
      <div className='h-screen flex flex-col justify-between'>
        <div className='flex justify-center'>
          <Spinner/>
        </div>
      </div>
    </div>
  }
  return (
    <FullBlog blog={blog} />
  )
}

export default Blog