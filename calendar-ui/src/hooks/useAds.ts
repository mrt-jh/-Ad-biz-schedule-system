import { useState, useEffect, useCallback } from 'react';
import { AdData } from '../constants/adConstants';
import * as adService from '../services/adService';

export const useAds = () => {
  const [ads, setAds] = useState<AdData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 광고 로드
  const loadAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adService.getAllAds();
      setAds(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '광고 로드 실패');
      console.error('광고 로드 오류:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 광고 추가
  const addAd = useCallback(async (ad: Partial<AdData>) => {
    try {
      setError(null);
      const newAd = await adService.createAd(ad);
      setAds(prev => [newAd, ...prev]);
      return newAd;
    } catch (err) {
      setError(err instanceof Error ? err.message : '광고 추가 실패');
      console.error('광고 추가 오류:', err);
      throw err;
    }
  }, []);

  // 광고 수정
  const updateAd = useCallback(async (id: string, updates: Partial<AdData>) => {
    try {
      setError(null);
      const updatedAd = await adService.updateAd(id, updates);
      setAds(prev => prev.map(ad => ad.id === id ? updatedAd : ad));
      return updatedAd;
    } catch (err) {
      setError(err instanceof Error ? err.message : '광고 수정 실패');
      console.error('광고 수정 오류:', err);
      throw err;
    }
  }, []);

  // 광고 삭제
  const deleteAd = useCallback(async (id: string) => {
    try {
      setError(null);
      await adService.deleteAd(id);
      setAds(prev => prev.filter(ad => ad.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '광고 삭제 실패');
      console.error('광고 삭제 오류:', err);
      throw err;
    }
  }, []);

  // 조건별 광고 조회
  const getAdsByFilter = useCallback(async (filters: {
    advertiserName?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    salesOwner?: string;
  }) => {
    try {
      setError(null);
      const filteredAds = await adService.getAdsByFilter(filters);
      return filteredAds;
    } catch (err) {
      setError(err instanceof Error ? err.message : '필터링 실패');
      console.error('필터링 오류:', err);
      throw err;
    }
  }, []);

  // 특정 날짜의 광고 조회
  const getAdsByDate = useCallback(async (date: string) => {
    try {
      setError(null);
      const dateAds = await adService.getAdsByDate(date);
      return dateAds;
    } catch (err) {
      setError(err instanceof Error ? err.message : '날짜별 조회 실패');
      console.error('날짜별 조회 오류:', err);
      throw err;
    }
  }, []);

  // Biz-core 광고 생성
  const createBizCoreAds = useCallback(async (mainAd: AdData) => {
    try {
      setError(null);
      const bizCoreAds = await adService.createBizCoreAds(mainAd);
      setAds(prev => [...bizCoreAds, ...prev]);
      return bizCoreAds;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Biz-core 광고 생성 실패');
      console.error('Biz-core 광고 생성 오류:', err);
      throw err;
    }
  }, []);

  // 초기 로드 (환경 변수가 없으면 스킵)
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      loadAds();
    } else {
      setLoading(false);
      setError('Supabase 환경 변수가 설정되지 않았습니다.');
    }
  }, [loadAds]);

  return {
    ads,
    loading,
    error,
    loadAds,
    addAd,
    updateAd,
    deleteAd,
    getAdsByFilter,
    getAdsByDate,
    createBizCoreAds,
  };
}; 