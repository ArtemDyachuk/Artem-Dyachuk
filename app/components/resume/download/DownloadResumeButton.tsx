import React from 'react';
import { MdDownload } from 'react-icons/md';
import styles from './DownloadResumeButton.module.css';

interface DownloadResumeButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
}

const DownloadResumeButton: React.FC<DownloadResumeButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
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
      href="/resume/Artem Dyachuk - Product Manager Resume.pdf" 
      download="Artem_Dyachuk_Product_Manager_Resume.pdf"
      className={buttonClasses}
      aria-label="Download Artem Dyachuk's resume as PDF"
    >
      <MdDownload size={size === 'small' ? 16 : size === 'large' ? 24 : 20} />
      Download Resume
    </a>
  );
};

export default DownloadResumeButton; 