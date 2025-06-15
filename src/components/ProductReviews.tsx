import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Star, User, Calendar, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Review {
  ID: number;
  user_id: string;
  product_id: string;
  rating: number;
  review_text: string;
  review_date: string;
  verified_purchase: boolean;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchReviews = async () => {
    try {
      const { data, error } = await window.ezsite.apis.tablePage(10400, {
        PageNo: 1,
        PageSize: 50,
        OrderByField: "review_date",
        IsAsc: false,
        Filters: [
        {
          name: "product_id",
          op: "Equal",
          value: productId
        }]

      });

      if (error) throw error;
      setReviews(data?.List || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review",
        variant: "destructive"
      });
      return;
    }

    if (!newReview.text.trim()) {
      toast({
        title: "Review Required",
        description: "Please write a review before submitting",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await window.ezsite.apis.tableCreate(10400, {
        user_id: user.ID,
        product_id: productId,
        rating: newReview.rating,
        review_text: newReview.text,
        review_date: new Date().toISOString(),
        verified_purchase: false // This would need to be checked against actual orders
      });

      if (error) throw error;

      setNewReview({ rating: 5, text: '' });
      setShowReviewForm(false);
      await fetchReviews();

      toast({
        title: "Review Submitted",
        description: "Thank you for your review!"
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1" data-id="fxacj6i4a" data-path="src/components/ProductReviews.tsx">
        {[1, 2, 3, 4, 5].map((star) =>
        <Star
          key={star}
          className={`w-5 h-5 ${
          star <= rating ?
          'text-yellow-400 fill-current' :
          'text-gray-300'} ${
          interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
          onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined} data-id="wey7b34k7" data-path="src/components/ProductReviews.tsx" />

        )}
      </div>);

  };

  const averageRating = reviews.length > 0 ?
  reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length :
  0;

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <div className="animate-pulse" data-id="un6q0qonn" data-path="src/components/ProductReviews.tsx">
        <div className="h-8 bg-gray-200 rounded mb-4" data-id="hbdv2mnab" data-path="src/components/ProductReviews.tsx"></div>
        <div className="space-y-4" data-id="b6tk77w7o" data-path="src/components/ProductReviews.tsx">
          {[1, 2, 3].map((i) =>
          <div key={i} className="h-24 bg-gray-200 rounded" data-id="m0iwzkyv9" data-path="src/components/ProductReviews.tsx"></div>
          )}
        </div>
      </div>);

  }

  return (
    <div className="space-y-6" data-id="sh1gjtqk8" data-path="src/components/ProductReviews.tsx">
      <div className="flex items-center justify-between" data-id="x7902rs73" data-path="src/components/ProductReviews.tsx">
        <div data-id="0r0dic781" data-path="src/components/ProductReviews.tsx">
          <h3 className="text-2xl font-bold text-gray-900" data-id="ve19naoq0" data-path="src/components/ProductReviews.tsx">Customer Reviews</h3>
          <div className="flex items-center space-x-4 mt-2" data-id="3qx8rsj8x" data-path="src/components/ProductReviews.tsx">
            {renderStars(Math.round(averageRating))}
            <span className="text-sm text-gray-600" data-id="6jwvfa7sn" data-path="src/components/ProductReviews.tsx">
              {averageRating.toFixed(1)} out of 5 ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
        
        {user &&
        <Button
          onClick={() => setShowReviewForm(!showReviewForm)}
          disabled={reviews.some((review) => review.user_id === user.ID)} data-id="btavy9kkw" data-path="src/components/ProductReviews.tsx">

            {reviews.some((review) => review.user_id === user.ID) ?
          'Review Already Submitted' :
          'Write a Review'
          }
          </Button>
        }
      </div>

      {showReviewForm &&
      <Card data-id="tuyhu07ks" data-path="src/components/ProductReviews.tsx">
          <CardHeader data-id="sgyyvyetq" data-path="src/components/ProductReviews.tsx">
            <CardTitle data-id="e6mlam56s" data-path="src/components/ProductReviews.tsx">Write Your Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-id="ugjfqhp36" data-path="src/components/ProductReviews.tsx">
            <div data-id="ehqalkwio" data-path="src/components/ProductReviews.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2" data-id="5tqpax839" data-path="src/components/ProductReviews.tsx">
                Rating
              </label>
              {renderStars(newReview.rating, true, (rating) =>
            setNewReview((prev) => ({ ...prev, rating }))
            )}
            </div>
            
            <div data-id="j9zgdfnvg" data-path="src/components/ProductReviews.tsx">
              <label className="block text-sm font-medium text-gray-700 mb-2" data-id="3vbjlg8b6" data-path="src/components/ProductReviews.tsx">
                Your Review
              </label>
              <Textarea
              value={newReview.text}
              onChange={(e) => setNewReview((prev) => ({ ...prev, text: e.target.value }))}
              placeholder="Share your experience with this product..."
              rows={4} data-id="7068xq7oa" data-path="src/components/ProductReviews.tsx" />

            </div>
            
            <div className="flex space-x-3" data-id="0l05c6t52" data-path="src/components/ProductReviews.tsx">
              <Button onClick={submitReview} disabled={submitting} data-id="svagydy8r" data-path="src/components/ProductReviews.tsx">
                {submitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)} data-id="ztr0wppjy" data-path="src/components/ProductReviews.tsx">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      }

      <div className="space-y-4" data-id="spl00n4i2" data-path="src/components/ProductReviews.tsx">
        {reviews.length === 0 ?
        <Card data-id="ylp3mhw2z" data-path="src/components/ProductReviews.tsx">
            <CardContent className="p-8 text-center" data-id="jj96pf85p" data-path="src/components/ProductReviews.tsx">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" data-id="d5ug9d1ex" data-path="src/components/ProductReviews.tsx" />
              <p className="text-gray-600" data-id="0uvhw72uc" data-path="src/components/ProductReviews.tsx">
                No reviews yet. Be the first to review this product!
              </p>
            </CardContent>
          </Card> :

        reviews.map((review) =>
        <Card key={review.ID} data-id="xi0rm8d86" data-path="src/components/ProductReviews.tsx">
              <CardContent className="p-6" data-id="ktdhvnxct" data-path="src/components/ProductReviews.tsx">
                <div className="flex items-start justify-between mb-3" data-id="psoz23nca" data-path="src/components/ProductReviews.tsx">
                  <div className="flex items-center space-x-3" data-id="2cuyhdfm3" data-path="src/components/ProductReviews.tsx">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center" data-id="az2xon4tz" data-path="src/components/ProductReviews.tsx">
                      <User className="w-5 h-5 text-gray-600" data-id="yv4fs4tgo" data-path="src/components/ProductReviews.tsx" />
                    </div>
                    <div data-id="fojr6n0vl" data-path="src/components/ProductReviews.tsx">
                      <div className="flex items-center space-x-2" data-id="c0x8z6ydm" data-path="src/components/ProductReviews.tsx">
                        <span className="font-medium text-gray-900" data-id="5mr8zmm6u" data-path="src/components/ProductReviews.tsx">Customer</span>
                        {review.verified_purchase &&
                    <span className="flex items-center text-green-600 text-sm" data-id="7k2xkd0u6" data-path="src/components/ProductReviews.tsx">
                            <CheckCircle className="w-4 h-4 mr-1" data-id="72njo7nwg" data-path="src/components/ProductReviews.tsx" />
                            Verified Purchase
                          </span>
                    }
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500" data-id="1ppq7w6u8" data-path="src/components/ProductReviews.tsx">
                        <Calendar className="w-4 h-4" data-id="87dnyuir3" data-path="src/components/ProductReviews.tsx" />
                        {new Date(review.review_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                
                <p className="text-gray-700 leading-relaxed" data-id="i93og5520" data-path="src/components/ProductReviews.tsx">
                  {review.review_text}
                </p>
              </CardContent>
            </Card>
        )
        }
      </div>
    </div>);

};

export default ProductReviews;