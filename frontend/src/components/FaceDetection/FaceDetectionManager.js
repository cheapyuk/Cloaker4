import { FaceDetection } from '@mediapipe/face_detection';

/**
 * FaceDetectionManager handles MediaPipe face detection
 * Detects up to 20 faces in real-time from video stream
 */
class FaceDetectionManager {
  constructor(config = {}) {
    this.faceDetection = null;
    this.camera = null;
    this.isInitialized = false;
    this.isRunning = false;
    
    // Configuration
    this.maxFaces = config.maxFaces || 20;
    this.detectionConfidence = config.detectionConfidence || 0.5;
    this.modelSelection = config.modelSelection || 0; // 0 for short-range, 1 for full-range
    
    // Callbacks
    this.onResults = config.onResults || (() => {});
    this.onError = config.onError || console.error;
    
    // Performance tracking
    this.lastDetectionTime = 0;
    this.lastFrameTime = 0;
    this.detectionCount = 0;
    this.targetFps = 10; // Target 10 FPS for detection
    this.frameInterval = 1000 / this.targetFps;
  }

  /**
   * Initialize MediaPipe Face Detection
   */
  async initialize() {
    if (this.isInitialized) {
      console.log('FaceDetectionManager already initialized');
      return;
    }

    try {
      console.log('🔄 Initializing MediaPipe Face Detection...');
      
      // Create face detection instance
      this.faceDetection = new FaceDetection({
        locateFile: (file) => {
          const url = `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
          console.log('📦 Loading:', file);
          return url;
        }
      });

      // Set up result callback IMMEDIATELY after creation
      this.faceDetection.onResults((results) => {
        console.log('👤 Faces detected:', results.detections?.length || 0);
        this.handleResults(results);
      });
      
      console.log('📝 Callback registered');

      // Configure face detection options
      await this.faceDetection.setOptions({
        model: 'short',
        minDetectionConfidence: this.detectionConfidence,
      });
      
      console.log('⚙️ Options configured');

      // Wait for complete initialization
      await this.faceDetection.initialize();
      
      this.isInitialized = true;
      console.log('✅ FaceDetectionManager ready!');
    } catch (error) {
      console.error('❌ Failed to initialize FaceDetectionManager:', error);
      this.onError(error);
      throw error;
    }
  }

  /**
   * Start face detection on a video element
   * @param {HTMLVideoElement} videoElement - The video element to detect faces from
   */
  async start(videoElement) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isRunning) {
      console.warn('FaceDetectionManager already running');
      return;
    }

    try {
      this.videoElement = videoElement;
      this.isRunning = true;
      
      // Start detection loop
      this.detectLoop();
      
      console.log('FaceDetectionManager started');
    } catch (error) {
      console.error('Failed to start FaceDetectionManager:', error);
      this.onError(error);
      throw error;
    }
  }

  /**
   * Detection loop
   */
  detectLoop() {
    if (!this.isRunning || !this.videoElement) {
      console.log('🛑 Detection loop stopped');
      return;
    }

    const now = performance.now();
    const elapsed = now - this.lastFrameTime;

    // Only process frame if enough time has passed (throttle to target FPS)
    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = now;
      
      try {
        if (this.videoElement.readyState >= 2) {
          // Don't await - send() triggers onResults callback separately
          this.faceDetection.send({ image: this.videoElement });
        } else {
          console.log('⏳ Video not ready, state:', this.videoElement.readyState);
        }
      } catch (error) {
        console.error('❌ Detection error:', error);
      }
    }

    // Continue loop
    if (this.isRunning) {
      requestAnimationFrame(() => this.detectLoop());
    }
  }

  /**
   * Stop face detection
   */
  stop() {
    this.isRunning = false;
    this.videoElement = null;
    console.log('FaceDetectionManager stopped');
  }

  /**
   * Handle detection results
   * @param {Object} results - MediaPipe detection results
   */
  handleResults(results) {
    const now = performance.now();
    const timeSinceLastDetection = now - this.lastDetectionTime;
    this.lastDetectionTime = now;
    
    // Calculate FPS
    const fps = timeSinceLastDetection > 0 ? 1000 / timeSinceLastDetection : 0;
    
    // Process detections
    const faces = this.processDetections(results.detections || []);
    
    // Track performance
    this.detectionCount++;
    
    // Call user callback with processed results
    this.onResults({
      faces,
      fps: Math.round(fps),
      timestamp: now,
      originalResults: results
    });
  }

  /**
   * Process raw MediaPipe detections into usable face data
   * @param {Array} detections - Raw MediaPipe detections
   * @returns {Array} Processed face data
   */
  processDetections(detections) {
    return detections.slice(0, this.maxFaces).map((detection, index) => {
      const bbox = detection.boundingBox;
      
      return {
        id: `face-${index}`, // Simple ID for now, will be enhanced with tracking
        boundingBox: {
          x: bbox.xMin,
          y: bbox.yMin,
          width: bbox.width,
          height: bbox.height,
          xCenter: bbox.xMin + bbox.width / 2,
          yCenter: bbox.yMin + bbox.height / 2
        },
        confidence: detection.score[0],
        landmarks: detection.landmarks,
        detection: detection
      };
    });
  }

  /**
   * Update detection options
   * @param {Object} options - New options to apply
   */
  updateOptions(options = {}) {
    if (options.maxFaces !== undefined) {
      this.maxFaces = options.maxFaces;
    }
    
    if (options.detectionConfidence !== undefined) {
      this.detectionConfidence = options.detectionConfidence;
    }
    
    if (options.modelSelection !== undefined) {
      this.modelSelection = options.modelSelection;
    }
    
    // Update MediaPipe options if initialized
    if (this.faceDetection) {
      this.faceDetection.setOptions({
        model: this.modelSelection === 0 ? 'short' : 'full',
        minDetectionConfidence: this.detectionConfidence,
      });
    }
  }

  /**
   * Get current statistics
   * @returns {Object} Current performance statistics
   */
  getStats() {
    return {
      isInitialized: this.isInitialized,
      isRunning: this.isRunning,
      detectionCount: this.detectionCount,
      maxFaces: this.maxFaces,
      detectionConfidence: this.detectionConfidence,
      modelSelection: this.modelSelection
    };
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.stop();
    
    if (this.faceDetection) {
      this.faceDetection.close();
      this.faceDetection = null;
    }
    
    this.isInitialized = false;
    console.log('FaceDetectionManager destroyed');
  }
}

export default FaceDetectionManager;