import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  nodes: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Nodes are required']
  },
  edges: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Edges are required']
  },
  generatedCode: {
    type: String,
    default: ''
  },
  // Additional metadata fields (similar to package.json)
  name: {
    type: String,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  version: {
    type: String,
    default: '1.0.0',
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['module', 'commonjs', 'esm'],
    default: 'module'
  },
  main: {
    type: String,
    trim: true,
    default: 'index.js'
  },
  scripts: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  keywords: {
    type: [String],
    default: []
  },
  author: {
    type: String,
    trim: true
  },
  license: {
    type: String,
    trim: true,
    default: 'ISC'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt before saving
projectSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
