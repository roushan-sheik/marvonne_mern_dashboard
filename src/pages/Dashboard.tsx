import { useGetAllStoriesQuery } from '../store/apiSlice';
import { Loader2, BookOpen, PlusCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data, isLoading, isError } = useGetAllStoriesQuery({});
  const stories = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load stories.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stories</h1>
          <p className="text-gray-500 mt-1">Manage and view your generated stories.</p>
        </div>
        <Link
          to="/create"
          className="flex items-center px-5 py-2.5 bg-[#bef264] text-[#0a192f] font-bold rounded-full hover:bg-[#bef264]-hover transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-200"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create New Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
          <BookOpen className="mx-auto h-16 w-16 text-[#0d9488]/30 mb-4" />
          <h3 className="text-xl font-bold text-gray-900">No stories yet</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">Turn your child's name and photo into a beautifully illustrated, personalized storybook they'll cherish forever.</p>
          <div className="mt-8">
            <Link
              to="/create"
              className="inline-flex items-center px-6 py-3 border border-transparent shadow-lg text-sm font-bold rounded-full text-[#0a192f] bg-[#bef264] hover:bg-[#bef264]-hover transition-colors hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5 mr-2 -ml-1" />
              Start Your Adventure
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story: any) => (
            <div
              key={story.id}
              className="bg-white rounded-3xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1"
            >
              <div className="h-56 bg-gradient-to-br from-[#0d9488]/20 to-[#0f3a4a]/20 relative overflow-hidden">
                {story.cover_image ? (
                  <img
                    src={story.cover_image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-[#0d9488]/40" />
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-[#0d9488] shadow-lg">
                  {story.age_group} yrs
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-extrabold text-gray-900 line-clamp-1">{story.title}</h3>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2 flex-1 leading-relaxed">
                  {story.description}
                </p>
                <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {story.page_count} Pages
                  </span>
                  <Link
                    to={`/preview/${story.id}`}
                    className="flex items-center text-sm font-bold text-[#0d9488] hover:text-[#0a192f] transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    Preview Story
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
