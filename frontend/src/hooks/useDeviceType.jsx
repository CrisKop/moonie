import { useState, useEffect } from 'react';

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|tablet/.test(userAgent);

    setDeviceType(isMobile ? 'mobile' : 'desktop');
  }, []);

  return deviceType;
};

export default useDeviceType;