const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobName: { 
    type: String, 
    required: true, 
    unique: true 
  },
  status: { 
    type: String, 
    enum: ['scheduled', 'running', 'completed', 'failed'], 
    default: 'scheduled' 
  },
  lastRun: { 
    type: Date 
  },
  nextRun: { 
    type: Date 
  },
  details: { 
    type: String 
  },
  metaData: {
    data: { type: mongoose.Schema.Types.Mixed },
    logs: { type: String }
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
});

module.exports = mongoose.model('Job', jobSchema);
