import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import screenfull from 'screenfull';
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './components/ui/dialog';
import { Alert, AlertDescription } from './components/ui/alert';
import { Maximize2, Minimize2, Camera, AlertCircle, RotateCcw } from 'lucide-react';
import { Toaster, toast } from 'sonner';

const VRCameraViewer = () => {
  const [cameraStream, setCameraStream] = useState(null);
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isPortrait, setIsPortrait] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hideControlsTimeoutRef = useRef(null);

  // Check orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Auto-hide controls
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    if (cameraStream && !error) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [cameraStream, error]);

  useEffect(() => {
    if (cameraStream) {
      resetControlsTimer();
    }
    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [cameraStream, resetControlsTimer]);

  // Handle tap to show controls
  const handleTap = () => {
    resetControlsTimer();
  };

  // Enumerate devices
  const enumerateDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setAvailableDevices(videoDevices);
      return videoDevices;
    } catch (err) {
      console.error('Error enumerating devices:', err);
      return [];
    }
  };

  // Start camera
  const startCamera = async (deviceId = null) => {
    setIsInitializing(true);
    setError(null);

    try {
      // Stop existing stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setHasPermission(true);

      // Attach to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Enumerate devices after permission granted (to get labels)
      const devices = await enumerateDevices();
      
      // Set selected device
      if (stream.getVideoTracks().length > 0) {
        const activeTrack = stream.getVideoTracks()[0];
        const settings = activeTrack.getSettings();
        setSelectedDeviceId(settings.deviceId || '');
        
        // Try to identify ultrawide camera
        const label = activeTrack.label.toLowerCase();
        if (label.includes('ultra') || label.includes('wide') || label.includes('0.5')) {
          toast.success('Ultra-wide camera detected!');
        }
      }

      toast.success('Camera started successfully');
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(err.message);
      setHasPermission(false);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setShowPermissionDialog(true);
      } else {
        toast.error(`Camera error: ${err.message}`);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  // Switch camera
  const switchCamera = async (deviceId) => {
    if (deviceId && deviceId !== selectedDeviceId) {
      await startCamera(deviceId);
    }
  };

  // Render to canvas (side-by-side stereoscopic)
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !cameraStream) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const render = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas size to match container
        const container = containerRef.current;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
        }

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const halfWidth = canvasWidth / 2;

        // Calculate video dimensions to maintain aspect ratio
        const videoAspect = video.videoWidth / video.videoHeight;
        const halfCanvasAspect = halfWidth / canvasHeight;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (videoAspect > halfCanvasAspect) {
          // Video is wider - fit to height
          drawHeight = canvasHeight;
          drawWidth = drawHeight * videoAspect;
          offsetX = (halfWidth - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Video is taller - fit to width
          drawWidth = halfWidth;
          drawHeight = drawWidth / videoAspect;
          offsetX = 0;
          offsetY = (canvasHeight - drawHeight) / 2;
        }

        // Clear canvas
        ctx.fillStyle = 'hsl(220, 15%, 5%)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw left eye (original)
        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);

        // Draw right eye (duplicate)
        ctx.drawImage(video, halfWidth + offsetX, offsetY, drawWidth, drawHeight);

        // Draw center divider
        ctx.fillStyle = 'rgba(210, 210, 220, 0.7)';
        ctx.fillRect(halfWidth - 1, 0, 2, canvasHeight);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraStream]);

  // Handle fullscreen
  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (screenfull.isEnabled) {
        await screenfull.toggle(containerRef.current);
        
        // Try to lock orientation to landscape on iOS
        if (screenfull.isFullscreen && screen.orientation && screen.orientation.lock) {
          try {
            await screen.orientation.lock('landscape');
          } catch (err) {
            console.log('Orientation lock not supported:', err);
          }
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
      toast.error('Unable to enter fullscreen');
    }
  };

  // Monitor fullscreen changes
  useEffect(() => {
    if (screenfull.isEnabled) {
      const handleFullscreenChange = () => {
        setIsFullscreen(screenfull.isFullscreen);
      };
      screenfull.on('change', handleFullscreenChange);
      return () => {
        screenfull.off('change', handleFullscreenChange);
      };
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [cameraStream]);

  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[hsl(var(--background))]" 
      onClick={handleTap}
      data-testid="vr-container"
    >
      <Toaster position="top-center" />
      
      {/* Canvas for stereoscopic view */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        data-testid="stereo-canvas"
      />

      {/* Hidden video element */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className="absolute -left-[9999px] opacity-0 pointer-events-none w-0 h-0"
        style={{ visibility: 'hidden' }}
        data-testid="video-element"
      />

      {/* Portrait warning overlay */}
      <AnimatePresence>
        {isPortrait && cameraStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[hsl(var(--scrim))]/90 flex items-center justify-center z-40 pointer-events-none"
            data-testid="portrait-warning"
          >
            <div className="text-center p-8">
              <RotateCcw className="w-16 h-16 mx-auto mb-4 text-[hsl(var(--warning))] animate-spin" style={{ animationDuration: '3s' }} />
              <h2 className="font-space text-2xl mb-2">Rotate to Landscape</h2>
              <p className="text-[hsl(var(--muted))]">
                For the best VR experience, please rotate your device to landscape mode
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-30"
            data-testid="controls-overlay"
          >
            {/* Top controls */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
              <div className="pointer-events-auto">
                <h1 className="font-space text-xl font-bold text-white drop-shadow-lg">
                  StereoCam VR
                </h1>
              </div>
              <div className="pointer-events-auto flex gap-2">
                <Button
                  onClick={toggleFullscreen}
                  size="icon"
                  variant="secondary"
                  className="bg-[hsl(var(--surface))]/80 backdrop-blur hover:bg-[hsl(var(--surface-2))]" 
                  data-testid="fullscreen-toggle-button"
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center gap-4">
              {!cameraStream && (
                <div className="pointer-events-auto flex flex-col items-center gap-4 max-w-md">
                  <Button
                    onClick={() => startCamera()}
                    disabled={isInitializing}
                    size="lg"
                    className="bg-[hsl(var(--primary))] hover:bg-cyan-500 text-white text-lg px-8 py-6 min-w-[200px]"
                    data-testid="start-camera-button"
                  >
                    <Camera className="w-6 h-6 mr-2" />
                    {isInitializing ? 'Starting...' : 'Start Camera'}
                  </Button>
                  
                  {error && (
                    <Alert variant="destructive" className="pointer-events-auto bg-[hsl(var(--danger))]/90 text-white border-0">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {cameraStream && availableDevices.length > 0 && (
                <div className="pointer-events-auto bg-[hsl(var(--surface))]/90 backdrop-blur rounded-lg p-4 max-w-md w-full">
                  <label className="block text-sm font-medium mb-2">Select Camera:</label>
                  <Select value={selectedDeviceId} onValueChange={switchCamera}>
                    <SelectTrigger className="w-full bg-[hsl(var(--surface-2))] border-[hsl(var(--border))]" data-testid="camera-select">
                      <SelectValue placeholder="Choose a camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDevices.map((device, index) => (
                        <SelectItem key={device.deviceId} value={device.deviceId} data-testid={`camera-option-${index}`}>
                          {device.label || `Camera ${index + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permission Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="bg-[hsl(var(--surface))] border-[hsl(var(--border))]" data-testid="permission-dialog">
          <DialogHeader>
            <DialogTitle className="font-space text-2xl">Camera Permission Needed</DialogTitle>
            <DialogDescription className="text-base space-y-4 pt-4">
              <p>
                This app needs access to your camera to display the stereoscopic VR view.
              </p>
              <p className="font-medium">
                To enable camera access:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Go to your device Settings</li>
                <li>Find Safari (or your browser)</li>
                <li>Tap Camera and select "Allow"</li>
                <li>Return to this page and try again</li>
              </ol>
              <p className="text-xs text-[hsl(var(--muted))]">
                Note: Camera access only works on HTTPS connections.
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              onClick={() => {
                setShowPermissionDialog(false);
                startCamera();
              }}
              className="flex-1 bg-[hsl(var(--primary))] hover:bg-cyan-500"
              data-testid="retry-permission-button"
            >
              Retry
            </Button>
            <Button
              onClick={() => setShowPermissionDialog(false)}
              variant="outline"
              className="flex-1"
              data-testid="close-dialog-button"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VRCameraViewer;