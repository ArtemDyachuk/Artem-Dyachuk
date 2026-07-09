import React from 'react';
import { MdDownload } from 'react-icons/md';
import styles from './DownloadResumeButton.module.css';

interface DownloadResumeButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  href?: string;
  /** Suggested save-as name (required — bare `download` uses the URL path segment). */
  downloadFilename?: string;
}

const DownloadResumeButton: React.FC<DownloadResumeButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  href = '/api/resume/download',
  downloadFilename,
}) => {
  const buttonClasses = [
    styles.downloadButton,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <a
      href={href}
      {...(downloadFilename ? { download: downloadFilename } : {})}
      className={buttonClasses}
      aria-label="Download resume"
    >
      <MdDownload size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
      Download Resume
    </a>
  );
};

export default DownloadResumeButton; 