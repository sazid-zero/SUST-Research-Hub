-- Add resource types to thesis_files table and seed showcase data

-- First, add a 'resource_type' column to categorize files
ALTER TABLE thesis_files 
ADD COLUMN IF NOT EXISTS resource_type VARCHAR(50) DEFAULT 'document',
ADD COLUMN IF NOT EXISTS external_url TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update file_type constraint to include new types
ALTER TABLE thesis_files 
DROP CONSTRAINT IF EXISTS thesis_files_file_type_check;

ALTER TABLE thesis_files 
ADD CONSTRAINT thesis_files_file_type_check 
CHECK (file_type IN ('pdf', 'presentation', 'video', 'audio', 'supplementary', 'code', 'dataset', 'model', 'csv', 'json', 'zip', 'link'));

-- Update existing files to be 'document' type
UPDATE thesis_files SET resource_type = 'document' WHERE resource_type IS NULL;

-- Fixed to reference theses by their actual titles from seed data

-- Add code repositories for Thesis 1 (Deep Learning for Image Recognition)
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1), 
'Source Code Repository', NULL, 0, 'link', 'code', 'https://github.com/sust-research/deep-learning-image-recognition', 'Complete implementation of CNN architectures and training scripts'),
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'Training Notebooks', NULL, 0, 'link', 'code', 'https://github.com/sust-research/ml-notebooks', 'Jupyter notebooks for model training and evaluation');

-- Add datasets for Thesis 1
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'ImageNet Subset', NULL, 524288000, 'link', 'dataset', 'https://drive.google.com/file/d/imagenet-subset-50k', 'Curated subset of ImageNet used for training (50,000 images)'),
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'Augmented Dataset', '/uploads/datasets/augmented-imagenet.zip', 2147483648, 'zip', 'dataset', NULL, 'Preprocessed and augmented training dataset');

-- Add models for Thesis 1
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'Trained CNN Model (ResNet-50)', '/uploads/models/resnet50-trained.h5', 102400000, 'model', 'model', NULL, 'Pre-trained ResNet-50 model weights achieving 94.2% accuracy'),
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'Custom Architecture Weights', NULL, 0, 'link', 'model', 'https://huggingface.co/sust-research/custom-cnn-v1', 'Novel architecture model weights hosted on Hugging Face');

-- Add results for Thesis 1
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'Performance Benchmarks', '/uploads/results/benchmarks.pdf', 2097152, 'pdf', 'result', NULL, 'Comprehensive performance comparison across different architectures'),
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'Training Logs', '/uploads/results/training-logs.csv', 524288, 'csv', 'result', NULL, 'Epoch-by-epoch training metrics and loss curves');

-- Add multimedia documents for Thesis 1
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, description) VALUES
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'Defense Presentation', '/uploads/documents/defense-slides.pptx', 15728640, 'presentation', 'document', 'Final thesis defense presentation slides'),
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'Demo Video', '/uploads/videos/system-demo.mp4', 52428800, 'video', 'document', 'Live demonstration of the image recognition system'),
((SELECT id FROM theses WHERE title = 'Deep Learning Approaches for Advanced Image Recognition' LIMIT 1),
'Audio Presentation', '/uploads/audio/research-overview.mp3', 8388608, 'audio', 'document', 'Audio explanation of research methodology');

-- Add code for Thesis 2 (Blockchain Security)
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Blockchain Technology: Security Analysis and Applications' LIMIT 1),
'Blockchain Implementation', NULL, 0, 'link', 'code', 'https://github.com/sust-research/blockchain-security', 'Complete blockchain implementation with security features'),
((SELECT id FROM theses WHERE title = 'Blockchain Technology: Security Analysis and Applications' LIMIT 1),
'Smart Contracts', NULL, 0, 'link', 'code', 'https://github.com/sust-research/blockchain-security/tree/main/contracts', 'Solidity smart contracts with security audits');

-- Add datasets for Thesis 2
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Blockchain Technology: Security Analysis and Applications' LIMIT 1),
'Transaction Dataset', NULL, 0, 'link', 'dataset', 'https://www.kaggle.com/datasets/blockchain-transactions', 'Real-world blockchain transaction data for analysis');

-- Add models for Thesis 2
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Blockchain Technology: Security Analysis and Applications' LIMIT 1),
'Attack Detection Model', '/uploads/models/attack-detection.pkl', 5242880, 'model', 'model', NULL, 'ML model for detecting security attacks on blockchain');

-- Add results for Thesis 2
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Blockchain Technology: Security Analysis and Applications' LIMIT 1),
'Security Analysis Report', '/uploads/results/security-analysis.pdf', 3145728, 'pdf', 'result', NULL, 'Detailed security vulnerability analysis and recommendations'),
((SELECT id FROM theses WHERE title = 'Blockchain Technology: Security Analysis and Applications' LIMIT 1),
'Defense Presentation', '/uploads/presentations/blockchain-defense.pptx', 12582912, 'presentation', 'document', NULL, 'Thesis defense presentation');

-- Add code for Thesis 15 (Autonomous Robotics)
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
'ROS Navigation Stack', NULL, 0, 'link', 'code', 'https://github.com/sust-research/autonomous-robot-nav', 'Complete ROS implementation with navigation algorithms'),
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
'Simulation Environment', NULL, 0, 'link', 'code', 'https://github.com/sust-research/robot-simulation', 'Gazebo simulation environment for testing');

-- Add datasets for Thesis 15
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
'Environment Maps', '/uploads/datasets/robot-maps.zip', 104857600, 'zip', 'dataset', NULL, 'Pre-mapped environments for navigation testing'),
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
'Sensor Data Logs', NULL, 0, 'link', 'dataset', 'https://drive.google.com/file/d/xyz789abc', 'Raw sensor data from real-world navigation tests');

-- Add models for Thesis 15
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
'Path Planning Model', '/uploads/models/path-planning.pth', 15728640, 'model', 'model', NULL, 'Trained neural network for optimal path planning');

-- Add results for Thesis 15
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, external_url, description) VALUES
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
'Navigation Benchmarks', '/uploads/results/nav-benchmarks.xlsx', 1048576, 'supplementary', 'result', NULL, 'Performance metrics across different environments');

-- Add multimedia for Thesis 15
INSERT INTO thesis_files (thesis_id, file_name, file_url, file_size, file_type, resource_type, description) VALUES
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
'Robot Demo Video', '/uploads/videos/robot-navigation-demo.mp4', 104857600, 'video', 'document', 'Live demonstration of autonomous navigation in complex environment'),
((SELECT id FROM theses WHERE title = 'Autonomous Robotics: Navigation and Decision-Making Systems' LIMIT 1),
'Technical Presentation', '/uploads/presentations/robotics-defense.pptx', 20971520, 'presentation', 'document', 'Comprehensive technical defense presentation');

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_thesis_files_resource_type ON thesis_files(resource_type);

COMMENT ON COLUMN thesis_files.resource_type IS 'Type: document, code, dataset, model, result';
COMMENT ON COLUMN thesis_files.external_url IS 'External URL for GitHub, Drive, Kaggle, etc. NULL for uploaded files';
COMMENT ON COLUMN thesis_files.description IS 'Detailed description of the resource';
