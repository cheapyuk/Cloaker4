import { useState, useEffect, useRef, useCallback } from 'react';
import FaceDetectionManager from '../components/FaceDetection/FaceDetectionManager';

/**
 * Custom React hook for face detection
 * @param {Object} config - Configuration options
 * @returns {Object} Face detection state and controls
 */
export const useFaceDetection = (config = {}) => {
  const [faces, setFaces] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [fps, setFps] = useState(0);
  const [error, setError] = useState(null);
  
  const managerRef = useRef(null);
  const videoElementRef = useRef(null);

  // Initialize manager on mount
  useEffect(() => {
    const manager = new FaceDetectionManager({
      maxFaces: config.maxFaces || 20,
      detectionConfidence: config.detectionConfidence || 0.5,
      modelSelection: config.modelSelection || 0,
      onResults: (results) => {
        setFaces(results.faces);
        setFps(results.fps);
      },
      onError: (err) => {
        console.error('Face detection error:', err);
        setError(err.message);
      }
    });

    managerRef.current = manager;

    return () => {
      if (managerRef.current) {
        managerRef.current.destroy();
      }
    };
  }, [config.maxFaces, config.detectionConfidence, config.modelSelection]);

  // Start face detection
  const startDetection = useCallback(async (videoElement) => {
    if (!managerRef.current || !videoElement) return;

    try {
      setError(null);
      videoElementRef.current = videoElement;
      
      await managerRef.current.initialize();
      setIsInitialized(true);
      
      await managerRef.current.start(videoElement);
      setIsEnabled(true);
    } catch (err) {
      console.error('Failed to start face detection:', err);
      setError(err.message);
    }
  }, []);

  // Stop face detection
  const stopDetection = useCallback(() => {
    if (managerRef.current) {
      managerRef.current.stop();
      setIsEnabled(false);
      setFaces([]);
      setFps(0);
    }
  }, []);

  // Toggle face detection
  const toggleDetection = useCallback(async (videoElement) => {
    if (isEnabled) {
      stopDetection();
    } else {
      await startDetection(videoElement);
    }
  }, [isEnabled, startDetection, stopDetection]);

  // Update options
  const updateOptions = useCallback((options) => {
    if (managerRef.current) {
      managerRef.current.updateOptions(options);
    }
  }, []);

  // Get stats
  const getStats = useCallback(() => {
    return managerRef.current ? managerRef.current.getStats() : null;
  }, []);

  return {
    faces,
    isEnabled,
    isInitialized,
    fps,
    error,
    startDetection,
    stopDetection,
    toggleDetection,
    updateOptions,
    getStats
  };
};

export default useFaceDetection;