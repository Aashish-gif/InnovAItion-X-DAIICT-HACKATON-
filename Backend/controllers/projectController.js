import Project from '../models/Project.js';

// @desc    Save a new project
// @route   POST /api/projects/save
// @access  Private
export const saveProject = async (req, res) => {
  try {
    const { 
      projectName, 
      nodes, 
      edges, 
      generatedCode,
      name,
      version,
      description,
      type,
      main,
      scripts,
      keywords,
      author,
      license
    } = req.body;

    // Validation
    if (!projectName || !nodes || !edges) {
      return res.status(400).json({
        success: false,
        message: 'Please provide projectName, nodes, and edges'
      });
    }

    const project = await Project.create({
      projectName,
      nodes,
      edges,
      generatedCode: generatedCode || '',
      name: name || projectName,
      version: version || '1.0.0',
      description: description || '',
      type: type || 'module',
      main: main || 'index.js',
      scripts: scripts || {},
      keywords: keywords || [],
      author: author || '',
      license: license || 'ISC',
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Project saved successfully',
      project
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while saving project',
      error: error.message
    });
  }
};

// @desc    Get all projects for logged-in user
// @route   GET /api/projects
// @access  Private
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching projects',
      error: error.message
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project belongs to the user
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This project does not belong to you.'
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching project',
      error: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const { 
      projectName, 
      nodes, 
      edges, 
      generatedCode,
      name,
      version,
      description,
      type,
      main,
      scripts,
      keywords,
      author,
      license
    } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project belongs to the user
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This project does not belong to you.'
      });
    }

    // Update fields
    if (projectName !== undefined) project.projectName = projectName;
    if (nodes !== undefined) project.nodes = nodes;
    if (edges !== undefined) project.edges = edges;
    if (generatedCode !== undefined) project.generatedCode = generatedCode;
    if (name !== undefined) project.name = name;
    if (version !== undefined) project.version = version;
    if (description !== undefined) project.description = description;
    if (type !== undefined) project.type = type;
    if (main !== undefined) project.main = main;
    if (scripts !== undefined) project.scripts = scripts;
    if (keywords !== undefined) project.keywords = keywords;
    if (author !== undefined) project.author = author;
    if (license !== undefined) project.license = license;

    project.updatedAt = Date.now();
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating project',
      error: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project belongs to the user
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. This project does not belong to you.'
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid project ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting project',
      error: error.message
    });
  }
};
