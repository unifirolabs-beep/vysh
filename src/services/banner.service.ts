import { apiFetch } from "./apiClient";

export interface FrontendBanner {
  id: string;
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_link?: string;
  image_url: string;
  mobile_image_url?: string;
  target_device: "all" | "desktop" | "mobile";
  sort_order: number;
}

export const bannerService = {
  async getActiveBanners(device: "all" | "desktop" | "mobile" = "all"): Promise<FrontendBanner[]> {
    const res = await apiFetch<FrontendBanner[]>(`/banners/active?device=${device}`);
    return res.success && res.data ? res.data : [];
  },
};
