import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const ReviewSection = ({ overview, reviews }) => {
  return (
    <section className="cinema-section dark-bg">
      <div className="content-grid">
        {/* Left: The Story */}
        <div className="story-column">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            The Story
          </motion.h2>
          <p className="overview-text">{overview}</p>
        </div>

        {/* Right: Reviews */}
        <div className="reviews-column">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Reviews
          </motion.h2>
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-author">{review.author}</span>
                    <span className="review-rating">
                      <FaStar /> {review.author_details?.rating || 8}/10
                    </span>
                  </div>
                  <p className="review-text">"{review.content.slice(0, 150)}..."</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;