import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Box, Typography, Button, CircularProgress, Paper } from '@mui/material';
import { PhotoCamera as CameraIcon } from '@mui/icons-material';

interface FaceScannerProps {
  onScan: (descriptor: string) => void;
  title: string;
  buttonText: string;
}

const FaceScanner: React.FC<FaceScannerProps> = ({ onScan, title, buttonText }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = window.location.origin + '/models';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading models:', err);
        setError('Failed to initialize face recognition. Ensure you are on HTTPS.');
        setLoading(false);
      }
    };
    loadModels();
  }, []);

  const startVideo = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera access is restricted. HTTPS is required for mobile devices.');
      return;
    }

    const constraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      }
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error starting video:', err);
        setError('Could not access camera. Please allow permissions.');
      });
  };

  const handleScan = async () => {
    if (!videoRef.current) return;
    setScanning(true);
    setError('');
    
    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const descriptorStr = detection.descriptor.join(',');
        onScan(descriptorStr);
        stopVideo();
      } else {
        setError('No face detected. Position yourself clearly in the frame.');
      }
    } catch (err) {
      setError('Scan failed. Please try again.');
    } finally {
      setScanning(false);
    }
  };

  const stopVideo = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => {
    if (modelsLoaded) {
      startVideo();
    }
    return () => stopVideo();
  }, [modelsLoaded]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Biometric Models...</Typography>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3, bgcolor: '#f8fafc' }}>
      <Typography variant="h6" fontWeight="700" gutterBottom color="#1e293b">
        {title}
      </Typography>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, mx: 'auto', mb: 2 }}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{ width: '100%', borderRadius: 12, transform: 'scaleX(-1)', border: '4px solid #e2e8f0' }}
        />
        
        {scanning && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(0,0,0,0.4)',
              borderRadius: 3,
            }}
          >
            <CircularProgress color="inherit" />
          </Box>
        )}
      </Box>

      <Button
        variant="contained"
        size="large"
        startIcon={<CameraIcon />}
        onClick={handleScan}
        disabled={scanning || !modelsLoaded}
        sx={{
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
          px: 4,
        }}
      >
        {scanning ? 'Analyzing...' : buttonText}
      </Button>
    </Paper>
  );
};

export default FaceScanner;
