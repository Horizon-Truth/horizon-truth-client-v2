import { useState, useEffect, useCallback } from 'react';

interface DeviceState {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isLowEndDevice: boolean;