import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, User, Clock, Search, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  tags: string[];
}

const mockBlogPosts: BlogPost[] = [
{
  id: '1',
  title: 'The Future of E-commerce: Trends to Watch in 2024',
  excerpt: 'Discover the latest trends shaping the e-commerce landscape and how they will impact online shopping experiences.',
  content: 'E-commerce continues to evolve at a rapid pace...',
  author: 'Sarah Johnson',
  date: '2024-01-15',
  readTime: '5 min read',
  category: 'Trends',
  image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  tags: ['E-commerce', 'Technology', 'Future']
},
{
  id: '2',
  title: 'Best Practices for Secure Online Shopping',
  excerpt: 'Learn essential tips to protect your personal information and ensure safe online shopping experiences.',
  content: 'Online security is more important than ever...',
  author: 'Mike Chen',
  date: '2024-01-12',
  readTime: '7 min read',
  category: 'Security',
  image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
  tags: ['Security', 'Shopping', 'Tips']
},
{
  id: '3',
  title: 'How to Choose the Perfect Electronics for Your Needs',
  excerpt: 'A comprehensive guide to selecting electronics that match your requirements and budget.',
  content: 'Choosing the right electronics can be overwhelming...',
  author: 'Alex Rivera',
  date: '2024-01-10',
  readTime: '6 min read',
  category: 'Guides',
  image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
  tags: ['Electronics', 'Guide', 'Shopping']
},
{
  id: '4',
  title: 'Sustainable Shopping: Making Eco-Friendly Choices',
  excerpt: 'Explore ways to make more sustainable shopping decisions and reduce your environmental impact.',
  content: 'Sustainability is becoming increasingly important...',
  author: 'Emma Green',
  date: '2024-01-08',
  readTime: '4 min read',
  category: 'Sustainability',
  image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
  tags: ['Sustainability', 'Environment', 'Shopping']
},
{
  id: '5',
  title: 'Smart Home Technology: Transform Your Living Space',
  excerpt: 'Discover the latest smart home devices and how they can enhance your daily life.',
  content: 'Smart home technology is revolutionizing...',
  author: 'David Kim',
  date: '2024-01-05',
  readTime: '8 min read',
  category: 'Technology',
  image: 'https://images.unsplash.com/photo-1476357471311-43c0db9fb2b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MTg3MTl8MHwxfHNlYXJjaHwxfHxBJTIwcGhvdG9ncmFwaCUyMHNob3djYXNpbmclMjBhJTIwbW9kZXJuJTIwYW5kJTIwc3R5bGlzaCUyMGludGVyaW9yJTIwZGVzaWduJTJDJTIwZW1waGFzaXppbmclMjBjbGVhbiUyMGxpbmVzJTIwYW5kJTIwY29udGVtcG9yYXJ5JTIwYWVzdGhldGljcy58ZW58MHx8fHwxNzQ4Mzc0MTU2fDA&ixlib=rb-4.1.0&q=80&w=200$w=600',
  tags: ['Smart Home', 'Technology', 'Innovation']
},
{
  id: '6',
  title: 'Fashion Trends for the Modern Professional',
  excerpt: 'Stay ahead of the curve with these professional fashion trends that blend style and functionality.',
  content: 'Professional fashion is evolving...',
  author: 'Lisa Thompson',
  date: '2024-01-03',
  readTime: '5 min read',
  category: 'Fashion',
  image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
  tags: ['Fashion', 'Professional', 'Style']
}];


const categories = ['All', 'Trends', 'Security', 'Guides', 'Sustainability', 'Technology', 'Fashion'];

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filteredPosts = mockBlogPosts.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50 py-8" data-id="eie3bw9n1" data-path="src/pages/BlogPage.tsx">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" data-id="a5ipi6fdo" data-path="src/pages/BlogPage.tsx">
          <Button
            variant="outline"
            onClick={() => setSelectedPost(null)}
            className="mb-6" data-id="hgpth8hhu" data-path="src/pages/BlogPage.tsx">

            ← Back to Blog
          </Button>
          
          <article className="bg-white rounded-lg shadow-md overflow-hidden" data-id="haiilwqpu" data-path="src/pages/BlogPage.tsx">
            <img
              src={selectedPost.image}
              alt={selectedPost.title}
              className="w-full h-64 md:h-96 object-cover" data-id="ow643m6nd" data-path="src/pages/BlogPage.tsx" />

            
            <div className="p-8" data-id="zjz57y1we" data-path="src/pages/BlogPage.tsx">
              <div className="flex items-center gap-4 mb-4" data-id="4jqufqrsp" data-path="src/pages/BlogPage.tsx">
                <Badge variant="secondary" data-id="49xrrn98b" data-path="src/pages/BlogPage.tsx">{selectedPost.category}</Badge>
                <div className="flex items-center text-sm text-gray-600" data-id="7tidp6m5p" data-path="src/pages/BlogPage.tsx">
                  <User className="w-4 h-4 mr-1" data-id="76238cjov" data-path="src/pages/BlogPage.tsx" />
                  {selectedPost.author}
                </div>
                <div className="flex items-center text-sm text-gray-600" data-id="lb1a41pxs" data-path="src/pages/BlogPage.tsx">
                  <Calendar className="w-4 h-4 mr-1" data-id="e6qjwshxw" data-path="src/pages/BlogPage.tsx" />
                  {new Date(selectedPost.date).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600" data-id="kb9aktdm4" data-path="src/pages/BlogPage.tsx">
                  <Clock className="w-4 h-4 mr-1" data-id="nmhu23sjx" data-path="src/pages/BlogPage.tsx" />
                  {selectedPost.readTime}
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-6" data-id="ejye566tz" data-path="src/pages/BlogPage.tsx">
                {selectedPost.title}
              </h1>
              
              <div className="prose max-w-none" data-id="9z4lg9yso" data-path="src/pages/BlogPage.tsx">
                <p className="text-lg text-gray-700 mb-6" data-id="kwegcj4ub" data-path="src/pages/BlogPage.tsx">
                  {selectedPost.excerpt}
                </p>
                <p className="text-gray-700" data-id="l0zpkmd3k" data-path="src/pages/BlogPage.tsx">
                  {selectedPost.content} Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad 
                  minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                  commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit 
                  esse cillum dolore eu fugiat nulla pariatur.
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200" data-id="61hhc7lng" data-path="src/pages/BlogPage.tsx">
                <h3 className="text-sm font-semibold text-gray-900 mb-2" data-id="nlz4nia17" data-path="src/pages/BlogPage.tsx">Tags:</h3>
                <div className="flex flex-wrap gap-2" data-id="rk5nxce3n" data-path="src/pages/BlogPage.tsx">
                  {selectedPost.tags.map((tag) =>
                  <Badge key={tag} variant="outline" className="text-xs" data-id="rrtesbuqq" data-path="src/pages/BlogPage.tsx">
                      {tag}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-id="c903affef" data-path="src/pages/BlogPage.tsx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-id="kw3c5s99u" data-path="src/pages/BlogPage.tsx">
        {/* Header */}
        <div className="text-center mb-12" data-id="an8jhtpbz" data-path="src/pages/BlogPage.tsx">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-id="wlv6x27au" data-path="src/pages/BlogPage.tsx">
            Our Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" data-id="wsdkg03x4" data-path="src/pages/BlogPage.tsx">
            Stay updated with the latest trends, tips, and insights in e-commerce and technology.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8" data-id="ycqrdmve5" data-path="src/pages/BlogPage.tsx">
          <div className="flex flex-col md:flex-row gap-4 mb-6" data-id="gxjuoe5av" data-path="src/pages/BlogPage.tsx">
            <div className="relative flex-1" data-id="jioz5i325" data-path="src/pages/BlogPage.tsx">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" data-id="562qcyh47" data-path="src/pages/BlogPage.tsx" />
              <Input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10" data-id="uoze9xzca" data-path="src/pages/BlogPage.tsx" />

            </div>
          </div>
          
          <div className="flex flex-wrap gap-2" data-id="5au5q2lbv" data-path="src/pages/BlogPage.tsx">
            {categories.map((category) =>
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)} data-id="wwh1zv11p" data-path="src/pages/BlogPage.tsx">

                {category}
              </Button>
            )}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-id="jamo7pumf" data-path="src/pages/BlogPage.tsx">
          {filteredPosts.map((post) =>
          <Card key={post.id} className="group cursor-pointer hover:shadow-lg transition-shadow" data-id="2j9dorfq7" data-path="src/pages/BlogPage.tsx">
              <div className="relative overflow-hidden rounded-t-lg" data-id="0idqsdq6i" data-path="src/pages/BlogPage.tsx">
                <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" data-id="hm0c18cuq" data-path="src/pages/BlogPage.tsx" />

                <Badge
                className="absolute top-4 left-4 bg-white text-gray-900"
                variant="secondary" data-id="uk5d90dlp" data-path="src/pages/BlogPage.tsx">

                  {post.category}
                </Badge>
              </div>
              
              <CardHeader data-id="4a3he5buf" data-path="src/pages/BlogPage.tsx">
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2" data-id="joqc8eai3" data-path="src/pages/BlogPage.tsx">
                  <div className="flex items-center" data-id="stju35m1e" data-path="src/pages/BlogPage.tsx">
                    <User className="w-4 h-4 mr-1" data-id="gg6618czq" data-path="src/pages/BlogPage.tsx" />
                    {post.author}
                  </div>
                  <div className="flex items-center" data-id="lhqct86cn" data-path="src/pages/BlogPage.tsx">
                    <Calendar className="w-4 h-4 mr-1" data-id="mdqeuqcrn" data-path="src/pages/BlogPage.tsx" />
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors" data-id="9g1chuz9g" data-path="src/pages/BlogPage.tsx">
                  {post.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent data-id="18tkhdw24" data-path="src/pages/BlogPage.tsx">
                <p className="text-gray-600 mb-4 line-clamp-3" data-id="69g27zkd2" data-path="src/pages/BlogPage.tsx">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between" data-id="o62t4od9u" data-path="src/pages/BlogPage.tsx">
                  <div className="flex items-center text-sm text-gray-500" data-id="utb16d7dh" data-path="src/pages/BlogPage.tsx">
                    <Clock className="w-4 h-4 mr-1" data-id="54r84o3b8" data-path="src/pages/BlogPage.tsx" />
                    {post.readTime}
                  </div>
                  
                  <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedPost(post)}
                  className="group/button" data-id="8w7l7lw7u" data-path="src/pages/BlogPage.tsx">

                    Read More
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/button:translate-x-1 transition-transform" data-id="0q1l5dei1" data-path="src/pages/BlogPage.tsx" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-4" data-id="7nz0ibip9" data-path="src/pages/BlogPage.tsx">
                  {post.tags.slice(0, 3).map((tag) =>
                <Badge key={tag} variant="outline" className="text-xs" data-id="ezl8lqcrc" data-path="src/pages/BlogPage.tsx">
                      {tag}
                    </Badge>
                )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {filteredPosts.length === 0 &&
        <div className="text-center py-12" data-id="h5za5cpt0" data-path="src/pages/BlogPage.tsx">
            <h3 className="text-lg font-semibold text-gray-900 mb-2" data-id="zqjid0ai3" data-path="src/pages/BlogPage.tsx">
              No posts found
            </h3>
            <p className="text-gray-600" data-id="d29jkhqtb" data-path="src/pages/BlogPage.tsx">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        }
      </div>
    </div>);

};

export default BlogPage;