// models/Article.js
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  estimatedReadTime: { type: Number }, // in minutes
  category: { type: String },
  tags: [String],
  therapeuticUse: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Article = mongoose.models.Article || mongoose.model('Article', articleSchema);
export default Article;
