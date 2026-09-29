import React, { useState, useRef, useEffect } from 'react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';
import { Camera, RefreshCw, Upload, Check, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (photoUrl: string, detectedPlate?: string) => void;
  defaultPlate?: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  defaultPlate = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLiveCameraActive, setIsLiveCameraActive] = useState<boolean>(false);
  const [extractedPlate, setExtractedPlate] = useState<string>(defaultPlate);

  // Preset sample shots for instant testing in sandboxes
  const SAMPLE_VEHICLE_PHOTOS = [
    {
      name: 'Sample Sedan Check-In',
      url: '/src/assets/images/sample_vehicle_checkin_1790713519472.jpg',
      plate: 'DB 44 ZN GP',
    },
    {
      name: 'Sample Foam Bay Detailing',
      url: '/src/assets/images/car_detailing_foam_1790713507938.jpg',
      plate: 'FB 19 XY GP',
    },
    {
      name: 'Sample Luxury Wash Bay',
      url: '/src/assets/images/hero_carwash_bay_1790713496421.jpg',
      plate: 'NW 88 KL GP',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access not supported in this browser.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      setIsLiveCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera stream warning:', err);
      setCameraError('Camera preview unavailable in current sandbox. You can upload an image or select a sample vehicle photo below.');
      setIsLiveCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsLiveCameraActive(false);
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: (typeof SAMPLE_VEHICLE_PHOTOS)[0]) => {
    setCapturedImage(sample.url);
    setExtractedPlate(sample.plate);
    stopCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage, extractedPlate);
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title="Capture Vehicle & Plate Photo"
      description="Record vehicle intake photo for service history and license plate identification"
    >
      <div className="space-y-4">
        {/* Viewport Box */}
        <div className="relative w-full aspect-video bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Vehicle snapshot"
              className="w-full h-full object-cover"
            />
          ) : isLiveCameraActive ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Number Plate Targeting Reticle */}
              <div className="absolute inset-x-8 sm:inset-x-20 inset-y-12 sm:inset-y-16 border-2 border-red-500/80 border-dashed rounded-lg pointer-events-none flex flex-col items-center justify-between p-3">
                <span className="text-[10px] uppercase font-mono tracking-widest text-red-400 bg-black/60 px-2 py-0.5 rounded">
                  ALIGN NUMBER PLATE HERE
                </span>
                <div className="w-16 h-1 bg-red-500 animate-pulse rounded" />
              </div>
            </>
          ) : (
            <div className="p-6 text-center space-y-3">
              <Camera className="w-12 h-12 text-neutral-600 mx-auto" />
              <p className="text-xs text-neutral-400 max-w-sm">
                {cameraError || 'Camera inactive. Choose a sample inspection photo or upload a vehicle image.'}
              </p>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Live Camera Controls */}
        {isLiveCameraActive && !capturedImage && (
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleTakeSnapshot}
              className="px-8 shadow-xl shadow-red-950/60"
            >
              <Camera className="w-5 h-5 mr-2" />
              Capture Photo
            </Button>
          </div>
        )}

        {/* After Snapshot Captured */}
        {capturedImage && (
          <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-600 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Photo Captured Successfully
              </span>
              <button
                onClick={handleRetake}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retake
              </button>
            </div>

            <div>
              <label className="text-xs text-neutral-300 font-600 uppercase tracking-wider block mb-1">
                Detected / Confirmed Number Plate
              </label>
              <input
                type="text"
                value={extractedPlate}
                onChange={(e) => setExtractedPlate(e.target.value.toUpperCase())}
                placeholder="e.g. DB 44 ZN GP"
                className="w-full bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-lg font-mono text-amber-400 text-sm tracking-wider font-700 focus:outline-none focus:border-red-600"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Verify the license plate matches the vehicle being checked in.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleConfirm}>
                Attach Photo &amp; Use Plate
              </Button>
            </div>
          </div>
        )}

        {/* Quick Fallback Options (Upload or Select Preset) */}
        {!capturedImage && (
          <div className="border-t border-neutral-800 pt-3">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Or choose inspection file / preset:</span>
              <label className="text-red-400 hover:text-red-300 font-600 cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_VEHICLE_PHOTOS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="group relative h-20 rounded-lg overflow-hidden border border-neutral-800 hover:border-red-500 transition-all text-left"
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-1.5 flex flex-col justify-end">
                    <span className="text-[10px] font-mono text-amber-400 font-700">
                      {sample.plate}
                    </span>
                    <span className="text-[9px] text-neutral-300 truncate">
                      {sample.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CameraCaptureModal;
