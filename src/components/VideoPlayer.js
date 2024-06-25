import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RefreshCw, FileVideo } from 'lucide-react';

const VideoPlayer = ({ onClose }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const updateTime = () => setCurrentTime(videoElement.currentTime);
      videoElement.addEventListener('timeupdate', updateTime);
      return () => videoElement.removeEventListener('timeupdate', updateTime);
    }
  }, [videoUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsLoading(true);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setIsPlaying(false);
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.load();
      }
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e) => {
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleVideoLoaded = () => {
    setIsLoading(false);
    setDuration(videoRef.current.duration);
    if (videoRef.current.paused) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      videoRef.current.play();
    }
  };

  const handleVideoError = () => {
    setIsLoading(false);
    console.error("Error loading video");
    // You might want to show an error message to the user here
  };

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black">
      {!videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <label className="px-4 py-2 bg-gray-800 text-white rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
            Select Video
            <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>
      )}
      {videoUrl && (
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full"
          onClick={togglePlayPause}
          onLoadedMetadata={handleVideoLoaded}
          onError={handleVideoError}
        />
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <RefreshCw className="text-white animate-spin" size={48} />
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div
          ref={progressBarRef}
          className="w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-2"
          onClick={handleSeek}
        >
          <motion.div
            className="h-full bg-white rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              className="focus:outline-none"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>
            <div className="flex items-center space-x-2">
              {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20"
              />
            </div>
            <span className="text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className="focus:outline-none"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </motion.button>
            <motion.label
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <FileVideo size={20} />
              <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
            </motion.label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;